import { useMemo, useState } from 'preact/hooks'
import { course } from '../app/context'
import type { LogEntry, Outcome } from '../data/types'
import { update, useStore, type LiveEntry } from '../state/store'
import { outcomeLabel, questionKey, type TutorResult } from '../engine/tutor'
import { expand, tokens } from '../engine/text'
import { AnswerBody } from '../shared/Answer'
import { SourceView } from '../shared/SourceView'
import { allSources } from '../app/context'
import { IconFlag, IconPencil, IconSearch } from '../ui/icons'
import { Button, Panel, Status, Switch, cx, fmtDay, fmtTime } from '../ui/kit'
import { PageHead } from './Console'
import { CorrectionPanel } from './Preview'

type Entry = (LogEntry & { live?: boolean; flagged?: boolean })

const TONE: Record<Outcome, 'good' | 'warn' | 'info' | 'muted'> = {
  answered: 'good',
  declined_pset: 'warn',
  sent_to_tfs: 'info',
  not_covered: 'muted',
}

const dayKey = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/New_York' })

function outcomeSentence(count: (o: Outcome) => number) {
  const parts = [
    [count('answered'), 'answered from your materials'],
    [count('declined_pset'), 'problem-set requests declined'],
    [count('sent_to_tfs'), 'sent to the TFs'],
    [count('not_covered'), 'not covered by anything you approved'],
  ]
    .filter(([n]) => (n as number) > 0)
    .map(([n, w]) => `${n} ${w}`)
  if (!parts.length) return ''
  const s = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0]
  return s.charAt(0).toUpperCase() + s.slice(1) + '.'
}

interface Repeat {
  lead: Entry
  members: Entry[]
  students: number
}

/** Groups of questions that ask the same thing in different words, within a topic. */
function repeats(entries: Entry[]): Repeat[] {
  const vec = entries.map((e) => new Set(expand(tokens(e.text)).map((x) => x.t)))
  const sim = (a: Set<string>, b: Set<string>) => {
    let n = 0
    for (const t of a) if (b.has(t)) n++
    return n / Math.max(1, Math.min(a.size, b.size))
  }
  const used = new Set<number>()
  const out: Repeat[] = []
  for (let i = 0; i < entries.length; i++) {
    if (used.has(i)) continue
    const group = [i]
    for (let j = i + 1; j < entries.length; j++) if (!used.has(j) && entries[j].topic === entries[i].topic && sim(vec[i], vec[j]) >= 0.34) group.push(j)
    if (group.length < 3) continue
    group.forEach((k) => used.add(k))
    // Lead with the question closest to all the others.
    // Lead with the question closest to all the others, preferring one that isn't a problem-set request.
    const lead = group
      .map((k) => ({ k, s: group.reduce((sum, o) => sum + (o === k ? 0 : sim(vec[k], vec[o])), 0) * (entries[k].answer.outcome === 'declined_pset' ? 0.5 : 1) }))
      .sort((a, b) => b.s - a.s)[0].k
    const members = group.map((k) => entries[k])
    out.push({ lead: entries[lead], members, students: new Set(members.map((m) => m.student)).size })
  }
  return out.sort((a, b) => b.members.length - a.members.length)
}

function DayChart({ days }: { days: { key: string; label: string; full: string; n: number; note?: string }[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(1, ...days.map((d) => d.n))
  const step = max <= 10 ? 2 : max <= 25 ? 5 : 10
  const top = Math.ceil(max / step) * step
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step)
  const W = 560
  const H = 180
  const padL = 28
  const padB = 26
  const padT = 18
  const plotH = H - padB - padT
  const band = (W - padL) / days.length
  const barW = Math.min(24, band * 0.5)
  const peak = days.reduce((m, d, i) => (d.n > days[m].n ? i : m), 0)
  const y = (v: number) => padT + plotH - (v / top) * plotH
  return (
    <figure class="daychart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Questions per day, peaking ${days[peak].label} with ${days[peak].n}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W} y1={y(t)} y2={y(t)} class={t === 0 ? 'dc-base' : 'dc-grid'} />
            <text x={padL - 8} y={y(t) + 4} class="dc-tick" text-anchor="end">
              {t}
            </text>
          </g>
        ))}
        {days.map((d, i) => {
          const x = padL + band * i + band / 2
          const h = (d.n / top) * plotH
          const r = Math.min(4, h / 2)
          const x0 = x - barW / 2
          const y0 = padT + plotH
          const path = h > 0 ? `M${x0},${y0} V${y0 - h + r} Q${x0},${y0 - h} ${x0 + r},${y0 - h} H${x0 + barW - r} Q${x0 + barW},${y0 - h} ${x0 + barW},${y0 - h + r} V${y0} Z` : ''
          return (
            <g
              key={d.key}
              class={cx('dc-col', i === peak && 'is-peak', hover === i && 'is-hover')}
              tabIndex={0}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
            >
              <rect x={x - band / 2} y={padT} width={band} height={plotH} class="dc-hit" />
              {path && <path d={path} class="dc-bar" />}
              {i === peak && (
                <text x={x} y={y0 - h - 6} class="dc-val" text-anchor="middle">
                  {d.n}
                </text>
              )}
              <text x={x} y={H - 8} class="dc-label" text-anchor="middle">
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
      {hover != null && (
        <div class="dc-tip" style={{ left: `${((padL + band * hover + band / 2) / W) * 100}%` }}>
          <strong class="tnum">{days[hover].n}</strong> questions
          <span class="muted">{days[hover].full}</span>
          {days[hover].note && <span class="muted">{days[hover].note}</span>}
        </div>
      )}
      <table class="sr-only">
        <caption>Questions per day</caption>
        <tbody>
          {days.map((d) => (
            <tr key={d.key}>
              <th>{d.label}</th>
              <td>{d.n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

export function Questions() {
  const s = useStore()
  const [topicF, setTopicF] = useState<string>('all')
  const [outcomeF, setOutcomeF] = useState<Outcome | 'all'>('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<Entry | null>(null)
  const [cluster, setCluster] = useState<string | null>(null)
  const [repeat, setRepeat] = useState<Repeat | null>(null)
  const [fix, setFix] = useState<{ q: string; r: TutorResult } | null>(null)
  const [src, setSrc] = useState<{ s: string; p?: string } | null>(null)

  const entries: Entry[] = useMemo(() => {
    const live: Entry[] = s.log.map((e: LiveEntry) => ({ ...e, live: true }))
    const sample: Entry[] = s.showSample ? course.sampleLog : []
    return [...live, ...sample].map((e) => ({ ...e, flagged: !!s.flags[e.id] }))
  }, [s.log, s.showSample, s.flags])

  const students = new Set(entries.map((e) => e.student)).size
  const count = (o: Outcome) => entries.filter((e) => e.answer.outcome === o).length

  const days = useMemo(() => {
    if (!entries.length) return []
    const keys = [...new Set(entries.map((e) => dayKey(e.at)))].sort()
    return keys.map((k) => {
      const n = entries.filter((e) => dayKey(e.at) === k).length
      const full = fmtDay(`${k}T12:00:00-04:00`)
      return { key: k, label: full.replace(/,.*/, ''), full, n }
    })
  }, [entries])

  const topics = useMemo(() => {
    const by = new Map<string, Entry[]>()
    for (const e of entries) by.set(e.topic, [...(by.get(e.topic) ?? []), e])
    return [...by]
      .map(([topic, es]) => ({
        topic,
        es,
        n: es.length,
        hard: es.filter((e) => e.answer.outcome === 'declined_pset' || e.answer.outcome === 'not_covered').length,
        byDay: days.map((d) => es.filter((e) => dayKey(e.at) === d.key).length),
      }))
      .sort((a, b) => b.n - a.n)
  }, [entries, days])

  const maxN = Math.max(1, ...topics.map((t) => t.n))
  const reps = useMemo(() => repeats(entries).slice(0, 3), [entries])
  const rows = entries.filter(
    (e) =>
      (topicF === 'all' || e.topic === topicF) &&
      (outcomeF === 'all' || e.answer.outcome === outcomeF) &&
      (!q.trim() || e.text.toLowerCase().includes(q.trim().toLowerCase())),
  )
  const rangeText = days.length ? `${days[0].full.replace(',', '')} to ${days[days.length - 1].full.replace(',', '')}` : ''
  const all = allSources(s)
  const source = src ? all.find((x) => x.id === src.s) : null

  return (
    <>
      <PageHead
        title="Questions"
        sub="Every question students ask, with the answer they got. Student names are hidden; each student has a number."
        actions={
          <label class="sample-toggle">
            <Switch id="sample-switch" checked={s.showSample} label="Show the sample week" onChange={(v) => update((st) => void (st.showSample = v))} />
            <span>Sample week</span>
          </label>
        }
      />

      {s.showSample && (
        <p class="sample-note">
          The sample week shows what one week looks like with {course.enrolled} students: example questions written for this demo, answered from your materials. Questions
          asked in the student view appear above them, marked <span class="badge badge-info">New</span>.
        </p>
      )}

      {entries.length === 0 ? (
        <div class="empty">
          <h2 class="section-title">No questions yet</h2>
          <p class="muted">
            When students use the tutor, every question appears here with the answer it gave. Open the student view and ask something to see it arrive, or turn on the
            sample week.
          </p>
          <a class="btn btn-secondary" href="#student">
            Open the student view
          </a>
        </div>
      ) : (
        <>
          <section class="digest" aria-labelledby="digest-title">
            <h2 id="digest-title" class="section-title">
              This week in your tutor
            </h2>
            <p class="digest-lede">
              <strong class="tnum">{entries.length}</strong> questions from <strong class="tnum">{students}</strong> students, {rangeText}. {outcomeSentence(count)}
            </p>
            {reps.length > 0 && (
              <div class="digest-top">
                <p>Asked again and again, in different words:</p>
                <ol class="repeats">
                  {reps.map((r) => (
                    <li key={r.lead.id}>
                      <button type="button" class="repeat" onClick={() => setRepeat(r)}>
                        <span class="repeat-n tnum">{r.members.length}</span>
                        <span class="repeat-text">
                          <span class="repeat-q">“{r.lead.text}”</span>
                          <span class="repeat-meta">
                            {r.lead.topic} · {r.students} students
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>

          <div class="q-grid">
            <section aria-labelledby="stuck-title" class="stuck">
              <div class="section-head">
                <h2 id="stuck-title" class="section-title">
                  Where the class is stuck
                </h2>
                <span class="muted small">By topic</span>
              </div>
              <ol class="topic-bars">
                {topics.map((t) => (
                  <li key={t.topic}>
                    <button type="button" class="topic-row" onClick={() => setCluster(t.topic)}>
                      <span class="topic-name">{t.topic}</span>
                      <span class="topic-bar-track" aria-hidden="true">
                        <span class="topic-bar" style={{ width: `${(t.n / maxN) * 100}%` }} />
                      </span>
                      <span class="topic-n tnum">{t.n}</span>
                      <span class="topic-hard tnum muted">{t.hard ? `${t.hard} declined or not covered` : ''}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
            <section aria-labelledby="days-title" class="days">
              <div class="section-head">
                <h2 id="days-title" class="section-title">
                  Questions per day
                </h2>
                <span class="muted small">Problem sets are due Fridays at 11:59 pm</span>
              </div>
              <DayChart days={days} />
            </section>
          </div>

          <section aria-labelledby="log-title" class="log">
            <div class="section-head">
              <h2 id="log-title" class="section-title">
                All questions
              </h2>
              <span class="muted small tnum">{rows.length} shown</span>
            </div>
            <div class="toolbar">
              <div class="search">
                <IconSearch size={16} />
                <label class="sr-only" for="q-search">
                  Search questions
                </label>
                <input id="q-search" class="input" placeholder="Search questions" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} />
              </div>
              <label class="sr-only" for="q-topic">
                Topic
              </label>
              <select id="q-topic" class="select select-sm" value={topicF} onChange={(e) => setTopicF((e.target as HTMLSelectElement).value)}>
                <option value="all">All topics</option>
                {topics.map((t) => (
                  <option key={t.topic} value={t.topic}>
                    {t.topic}
                  </option>
                ))}
              </select>
              <label class="sr-only" for="q-outcome">
                Outcome
              </label>
              <select id="q-outcome" class="select select-sm" value={outcomeF} onChange={(e) => setOutcomeF((e.target as HTMLSelectElement).value as Outcome | 'all')}>
                <option value="all">All outcomes</option>
                {(Object.keys(outcomeLabel) as Outcome[]).map((o) => (
                  <option key={o} value={o}>
                    {outcomeLabel[o]}
                  </option>
                ))}
              </select>
            </div>
            <div class="table-wrap">
              <table class="table log-table">
                <thead>
                  <tr>
                    <th class="col-when">When</th>
                    <th>Question</th>
                    <th class="col-topic">Topic</th>
                    <th class="col-outcome">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((e) => (
                    <tr key={e.id} class="is-clickable" onClick={() => setOpen(e)}>
                      <td class="col-when tnum muted">
                        <span class="when-day">{fmtDay(e.at).replace(/,.*/, '')}</span> {fmtTime(e.at)}
                      </td>
                      <td class="col-q">
                        <button type="button" class="q-text" onClick={(ev) => (ev.stopPropagation(), setOpen(e))}>
                          {e.live && <span class="badge badge-info">New</span>}
                          {e.flagged && <IconFlag size={14} class="q-flag" title="Flagged" />}
                          <span>{e.text}</span>
                        </button>
                      </td>
                      <td class="col-topic muted">{e.topic}</td>
                      <td class="col-outcome">
                        <Status tone={TONE[e.answer.outcome]}>{outcomeLabel[e.answer.outcome]}</Status>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={4} class="empty-row">
                        No questions match.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <Panel
        open={!!open}
        onClose={() => setOpen(null)}
        width={560}
        title={open ? `${open.student}` : ''}
        sub={open ? `${fmtDay(open.at)}, ${fmtTime(open.at)} · ${open.topic}` : undefined}
      >
        {open && (
          <div class="q-detail">
            <div class="turn-user">
              <p>{open.text}</p>
            </div>
            <div>
              <Status tone={TONE[open.answer.outcome]}>{outcomeLabel[open.answer.outcome]}</Status>
              <div class="q-detail-answer">
                <AnswerBody body={open.answer.body} onOpen={(s2, p) => setSrc({ s: s2, p })} />
              </div>
            </div>
            <div class="form-actions">
              <Button variant="secondary" icon={<IconPencil size={15} />} onClick={() => setFix({ q: open.text, r: { answer: open.answer, method: 'prepared', read: [] } })}>
                Correct this answer
              </Button>
              <Button
                variant="ghost"
                icon={<IconFlag size={15} />}
                onClick={() =>
                  update(
                    (st) => {
                      st.flags[open.id] = !st.flags[open.id]
                    },
                    { kind: 'flagged', detail: `${s.flags[open.id] ? 'Unflagged' : 'Flagged'} a question for section` },
                  )
                }
              >
                {s.flags[open.id] ? 'Unflag' : 'Flag for section'}
              </Button>
            </div>
            {s.corrections.some((c) => questionKey(c.question) === questionKey(open.text)) && (
              <p class="muted small">You’ve written your own answer to this question. Students asking it now get your version.</p>
            )}
          </div>
        )}
      </Panel>

      <Panel open={!!cluster} onClose={() => setCluster(null)} width={560} title={cluster ?? ''} sub={cluster ? `${topics.find((t) => t.topic === cluster)?.n ?? 0} questions` : undefined}>
        <ul class="cluster-list">
          {topics
            .find((t) => t.topic === cluster)
            ?.es.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  class="cluster-q"
                  onClick={() => {
                    setCluster(null)
                    setOpen(e)
                  }}
                >
                  <span>{e.text}</span>
                  <span class="cluster-meta">
                    <span class="muted tnum">
                      {fmtDay(e.at).replace(/,.*/, '')} {fmtTime(e.at)}
                    </span>
                    <Status tone={TONE[e.answer.outcome]}>{outcomeLabel[e.answer.outcome]}</Status>
                  </span>
                </button>
              </li>
            ))}
        </ul>
        <p class="muted small cluster-foot">
          A cluster this size may be worth five minutes at the start of the next lecture, or a note to the TFs for section.
        </p>
      </Panel>

      <Panel
        open={!!repeat}
        onClose={() => setRepeat(null)}
        width={560}
        title={repeat ? `${repeat.members.length} versions of one question` : ''}
        sub={repeat ? `${repeat.lead.topic} · asked by ${repeat.students} students` : undefined}
      >
        <ul class="cluster-list">
          {repeat?.members.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                class="cluster-q"
                onClick={() => {
                  setRepeat(null)
                  setOpen(e)
                }}
              >
                <span>{e.text}</span>
                <span class="cluster-meta">
                  <span class="muted tnum">
                    {fmtDay(e.at).replace(/,.*/, '')} {fmtTime(e.at)}
                  </span>
                  <Status tone={TONE[e.answer.outcome]}>{outcomeLabel[e.answer.outcome]}</Status>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p class="muted small cluster-foot">One clear answer in lecture or a pinned Ed post would cover all of these. You can also write the tutor’s answer yourself from any of them.</p>
      </Panel>

      <Panel open={!!source} onClose={() => setSrc(null)} title={source?.title ?? ''} width={520}>
        {source && <SourceView source={source} focus={src?.p} hidden={source.mode === 'recognize'} />}
      </Panel>
      <CorrectionPanel question={fix?.q ?? null} result={fix?.r ?? null} onClose={() => setFix(null)} />
    </>
  )
}
