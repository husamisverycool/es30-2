// The founder's tracker for the ten-professor pilot from Assignment 2a. Kept in this browser.
import { useEffect, useState } from 'preact/hooks'

export const STAGES = [
  { id: 'not_contacted', label: 'Not contacted' },
  { id: 'emailed', label: 'Emailed' },
  { id: 'no_reply', label: 'No reply' },
  { id: 'replied', label: 'Replied' },
  { id: 'meeting', label: 'Meeting held' },
  { id: 'handed_over', label: 'Handed over materials' },
  { id: 'live', label: 'Tutor live' },
  { id: 'announced', label: 'Announced to class' },
  { id: 'declined', label: 'Said no' },
] as const
export type Stage = (typeof STAGES)[number]['id']

export const REASONS = ['Effort', 'Accuracy', 'Policy', 'Fear of replacement', 'Other'] as const
export type Reason = (typeof REASONS)[number] | ''

export interface Prospect {
  id: string
  name: string
  dept: string
  course: string
  stage: Stage
  reason: Reason
  notes: string
  /** When each stage was first reached, ISO. */
  at: Partial<Record<Stage, string>>
}

export interface Pilot {
  v: 1
  rows: Prospect[]
  students: { asked: number; enrolled: number }
  sender: string
}

const KEY = 'lectern:pilot:v1'
const blankRow = (i: number): Prospect => ({ id: `p${Date.now().toString(36)}${i}`, name: '', dept: '', course: '', stage: 'not_contacted', reason: '', notes: '', at: {} })
const fresh = (): Pilot => ({ v: 1, rows: Array.from({ length: 10 }, (_, i) => blankRow(i)), students: { asked: 0, enrolled: 0 }, sender: '' })

function load(): Pilot {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (p?.v === 1) return { ...fresh(), ...p }
    }
  } catch {
    /* storage blocked */
  }
  return fresh()
}

let pilot = load()
const subs = new Set<() => void>()

export function updatePilot(fn: (p: Pilot) => void) {
  const next: Pilot = structuredClone(pilot)
  fn(next)
  pilot = next
  try {
    localStorage.setItem(KEY, JSON.stringify(pilot))
  } catch {
    /* storage blocked: changes last for this page only */
  }
  subs.forEach((s) => s())
}

export function setStage(id: string, stage: Stage) {
  updatePilot((p) => {
    const r = p.rows.find((x) => x.id === id)
    if (!r) return
    r.stage = stage
    if (!r.at[stage]) r.at[stage] = new Date().toISOString()
    if (stage !== 'declined') r.reason = ''
  })
}

export function addRow() {
  updatePilot((p) => void p.rows.push(blankRow(p.rows.length)))
}

export function usePilot(): Pilot {
  const [, force] = useState(0)
  useEffect(() => {
    const s = () => force((n) => n + 1)
    subs.add(s)
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        pilot = load()
        s()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      subs.delete(s)
      window.removeEventListener('storage', onStorage)
    }
  }, [])
  return pilot
}

const REPLIED: Stage[] = ['replied', 'meeting', 'handed_over', 'live', 'announced', 'declined']
const HANDED: Stage[] = ['handed_over', 'live', 'announced']
const DAY = 86400_000

/** The four numbers from the 2a plan, with their success and kill thresholds. */
export function scoreboard(p: Pilot) {
  const contacted = p.rows.filter((r) => r.stage !== 'not_contacted')
  const n = Math.max(10, contacted.length)
  const within = (r: Prospect, stage: Stage[], days: number) => {
    const sent = r.at.emailed
    const hit = stage.map((s) => r.at[s]).filter(Boolean).sort()[0]
    if (!hit) return false
    return !sent || new Date(hit).getTime() - new Date(sent).getTime() <= days * DAY
  }
  const replied = contacted.filter((r) => REPLIED.includes(r.stage) && within(r, REPLIED, 7)).length
  const handed = contacted.filter((r) => HANDED.includes(r.stage) && within(r, HANDED, 14)).length
  const announced = contacted.filter((r) => r.stage === 'announced').length
  const usage = p.students.enrolled > 0 ? (p.students.asked / p.students.enrolled) * 100 : null
  // The two-week clock starts at the first email; rows logged straight to a later stage start it at that date.
  const firstEmail = contacted.map((r) => r.at.emailed).filter(Boolean).sort()[0] ?? contacted.flatMap((r) => Object.values(r.at)).filter(Boolean).sort()[0]
  const daysIn = firstEmail ? Math.floor((Date.now() - new Date(firstEmail).getTime()) / DAY) + 1 : null
  const reasons = Object.fromEntries(REASONS.map((x) => [x, p.rows.filter((r) => r.stage === 'declined' && r.reason === x).length])) as Record<string, number>
  return { n, contacted: contacted.length, replied, handed, announced, usage, daysIn, reasons, declined: p.rows.filter((r) => r.stage === 'declined').length }
}

export type Tone = 'good' | 'warn' | 'bad' | 'muted'
/** While the two-week window is open (`settled` false), a low number is only "so far", never a kill. */
export function grade(value: number | null, success: number, kill: number, killInclusive = false, settled = true): { tone: Tone; word: string } {
  if (value == null) return { tone: 'muted', word: 'No data yet' }
  if (value >= success) return { tone: 'good', word: 'Meets the target' }
  if (!settled) return { tone: 'muted', word: 'Below target so far' }
  if (killInclusive ? value <= kill : value < kill) return { tone: 'bad', word: 'In the kill zone' }
  return { tone: 'warn', word: 'Below target' }
}

export const windowOpen = (s: ReturnType<typeof scoreboard>) => s.daysIn == null || s.daysIn <= 14

export function verdict(s: ReturnType<typeof scoreboard>): { tone: Tone; text: string } {
  if (s.contacted === 0) return { tone: 'muted', text: 'No professors contacted yet. Send the offer email below to the ten on your list, then log each reply here.' }
  if (s.handed >= 3 && s.announced >= 2) return { tone: 'good', text: 'The assumption holds: at least three professors handed over their materials and at least two announced it. Supply is not the blocker.' }
  if (windowOpen(s)) {
    const needHand = Math.max(0, 3 - s.handed)
    const needAnnounce = Math.max(0, 2 - s.announced)
    const parts = [
      needHand > 0 && `${needHand} more ${needHand === 1 ? 'professor needs' : 'professors need'} to hand over materials`,
      needAnnounce > 0 && `${needAnnounce} more ${needAnnounce === 1 ? 'needs' : 'need'} to announce it`,
    ].filter(Boolean)
    return { tone: 'muted', text: `In progress, day ${s.daysIn ?? 1} of 14. ${parts.join(', and ')}.` }
  }
  if (s.handed >= 3)
    return {
      tone: 'warn',
      text:
        s.announced === 0
          ? 'Revise: professors will allow the tutor but won’t put their name on it. That is the value proposition failing, not the product.'
          : 'Revise: three or more handed over materials but only one announced it. Ask the others what stopped them from posting.',
    }
  if (s.handed < 1 || s.replied < 2) return { tone: 'bad', text: 'Kill: fewer than one in ten agreed. Professors won’t say yes to this offer as written.' }
  return { tone: 'warn', text: 'Revise: between one and three agreements. Read the no answers below to see whether the objection was effort, accuracy, policy or the fear of replacement.' }
}

export function toCsv(p: Pilot) {
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
  const head = ['Professor', 'Department', 'Course', 'Stage', 'Reason for no', 'Emailed', 'Replied', 'Handed over', 'Announced', 'Notes']
  // Calendar dates in Eastern time, matching what the tracker shows.
  const d = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/New_York' }) : '')
  const rows = p.rows
    .filter((r) => r.name || r.stage !== 'not_contacted')
    .map((r) => [r.name, r.dept, r.course, STAGES.find((s) => s.id === r.stage)?.label ?? r.stage, r.reason, d(r.at.emailed), d(r.at.replied ?? r.at.declined), d(r.at.handed_over), d(r.at.announced), r.notes])
  return [head, ...rows].map((r) => r.map((v) => esc(String(v ?? ''))).join(',')).join('\n')
}
