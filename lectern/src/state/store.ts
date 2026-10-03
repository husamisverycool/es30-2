import { useEffect, useState } from 'preact/hooks'
import type { Answer, LogEntry, ReviewStatus, Source } from '../data/types'
import type { Correction, Method } from '../engine/tutor'

export type ActivityKind =
  | 'opened'
  | 'approved'
  | 'excluded'
  | 'reset-source'
  | 'added-source'
  | 'removed-source'
  | 'rule'
  | 'custom-rule'
  | 'tested'
  | 'marked-good'
  | 'corrected'
  | 'live-on'
  | 'live-off'
  | 'copied-announcement'
  | 'posted-announcement'
  | 'flagged'
  | 'rules-confirmed'
  | 'paused'
  | 'rated'

export interface Activity {
  at: string
  kind: ActivityKind
  detail: string
}

export interface LiveEntry extends LogEntry {
  method: Method
  flagged?: boolean
}

export interface State {
  v: 1
  statuses: Record<string, ReviewStatus>
  uploads: Source[]
  rules: Record<string, boolean>
  customRules: { id: string; text: string }[]
  live: boolean
  liveSince?: string
  corrections: Correction[]
  verdicts: Record<string, 'good' | 'bad'>
  log: LiveEntry[]
  flags: Record<string, boolean>
  activity: Activity[]
  announcement: { title: string; body: string; copiedAt?: string; postedAt?: string } | null
  showSample: boolean
  studentId: string
  rulesConfirmedAt?: string
  /** Live, but paused for a window (e.g. during an exam). */
  pause?: { from: string; to: string; label: string }
  /** Professor's rating of each previewed answer, keyed by question text key. */
  ratings: Record<string, 'good' | 'poor'>
  previewCount: number
}

const KEY = 'lectern:chem11:v1'

const fresh = (): State => ({
  v: 1,
  statuses: {},
  uploads: [],
  rules: {},
  customRules: [],
  live: false,
  corrections: [],
  verdicts: {},
  log: [],
  flags: {},
  activity: [],
  announcement: null,
  showSample: true,
  ratings: {},
  previewCount: 0,
  studentId: `Student ${String(1000 + Math.floor(Math.random() * 8999)).padStart(4, '0')}`,
})

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw)
      if (s && s.v === 1) return { ...fresh(), ...s }
    }
  } catch {
    /* storage blocked: run in memory */
  }
  return fresh()
}

let state: State = load()
const listeners = new Set<() => void>()
let persistOk = true

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
    persistOk = true
  } catch {
    persistOk = false
  }
}

export const canPersist = () => persistOk

/** Whether students can use the tutor right now. */
export function isLive(s: State, now = Date.now()) {
  return s.live && !inPause(s, now)
}

export function inPause(s: State, now = Date.now()) {
  return !!s.pause && new Date(s.pause.from).getTime() <= now && now < new Date(s.pause.to).getTime()
}

export function getState() {
  return state
}

export function update(fn: (s: State) => State | void, activity?: Omit<Activity, 'at'>) {
  const draft: State = structuredClone(state)
  const next = fn(draft) ?? draft
  if (activity) next.activity = [{ ...activity, at: new Date().toISOString() }, ...next.activity].slice(0, 200)
  state = next
  persist()
  listeners.forEach((l) => l())
}

export function resetAll() {
  state = { ...fresh(), studentId: state.studentId }
  persist()
  listeners.forEach((l) => l())
}

// Other tabs (e.g. the student view open beside the console) see changes as they happen.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return
    state = load()
    listeners.forEach((l) => l())
  })
}

export function useStore(): State {
  const [, force] = useState(0)
  useEffect(() => {
    const l = () => force((n) => n + 1)
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }, [])
  return state
}

export function logActivityOnce(kind: ActivityKind, detail: string) {
  if (state.activity.some((a) => a.kind === kind)) return
  update(() => {}, { kind, detail })
}

export function addLiveEntry(text: string, topic: string, answer: Answer, method: Method) {
  const entry: LiveEntry = {
    id: `live-${Date.now().toString(36)}`,
    at: new Date().toISOString(),
    student: state.studentId,
    text,
    topic,
    answer,
    method,
  }
  update((s) => {
    s.log = [entry, ...s.log].slice(0, 300)
  })
  return entry
}
