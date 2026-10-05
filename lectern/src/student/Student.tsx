import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { course, allSources, statusOf, useTutorContext, prof, isDemo } from '../app/context'
import { addLiveEntry, isLive, update, useStore } from '../state/store'
import { classify } from '../engine/classify'
import { Composer, TutorTurn, useChat, useSuggestions } from '../shared/Chat'
import { SourceView } from '../shared/SourceView'
import { citeText } from '../shared/Answer'
import { IconThumb, IconLectern, IconPause, IconCopy, kindIcon } from '../ui/icons'
import { Panel, Status, toast, copyText, fmtDate, plural } from '../ui/kit'
import type { Source } from '../data/types'
import { published } from '../state/publish'

// Each starter has an answer prepared from her materials, so the first click reads like her.
const DEMO_STARTERS = ['When can we use the small x approximation?', 'Can Q be bigger than K?', 'If I multiply a reaction by 2, does K double?']
const OWN_STARTERS = ['What does the syllabus say about late work?', 'When is the first exam?', 'What was the main idea of the last lecture?']

function countBy(sources: Source[]) {
  const n = (k: string) => sources.filter((s) => s.kind === k).length
  const ed = sources.find((s) => s.kind === 'ed')
  const parts: string[] = []
  if (n('lecture')) parts.push(plural(n('lecture'), 'lecture'))
  if (n('slides')) parts.push(plural(n('slides'), 'slide deck'))
  if (n('syllabus')) parts.push('the syllabus')
  if (n('exam')) parts.push(n('exam') === 1 ? 'a practice exam' : `${n('exam')} practice exams`)
  if (ed) parts.push(`${prof.short}’s answers on Ed`)
  if (n('upload')) parts.push(`${n('upload')} added ${n('upload') === 1 ? 'file' : 'files'}`)
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0] ?? 'no materials yet'
}

export function Student() {
  const s = useStore()
  const ctx = useTutorContext()
  const [panel, setPanel] = useState<{ sourceId: string; passageId?: string } | null>(null)
  const [scopeOpen, setScopeOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const [flagFor, setFlagFor] = useState<string | null>(null)

  const approved = useMemo(() => allSources(s).filter((x) => statusOf(s, x) === 'approved' && x.mode === 'answer'), [s.statuses, s.uploads])
  const lastUpdate = useMemo(() => {
    const a = s.activity.find((x) => x.kind === 'approved' || x.kind === 'excluded' || x.kind === 'added-source')
    return a ? fmtDate(a.at) : fmtDate(new Date().toISOString())
  }, [s.activity])

  const lastEntryFor = useRef(new Map<string, string>())
  const chat = useChat(ctx, (q, r) => {
    const entry = addLiveEntry(q, classify(q, course), r.answer, r.method)
    lastEntryFor.current.set(q, entry.id)
  })
  const asked = chat.turns.filter((t) => t.role === 'user').map((t) => (t as { text: string }).text)
  const lastTopic = asked.length ? classify(asked[asked.length - 1], course) : null
  const suggestions = useSuggestions(lastTopic, asked, isDemo() ? DEMO_STARTERS : OWN_STARTERS)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [chat.turns.length, chat.turns[chat.turns.length - 1]])

  const [, tick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 30000)
    return () => clearInterval(t)
  }, [])
  const live = isLive(s)
  const panelSource = panel ? allSources(s).find((x) => x.id === panel.sourceId) : null

  return (
    <div class="student">
      <header class="student-top">
        <div class="student-id">
          <span class="student-mark" aria-hidden="true">
            <IconLectern size={18} />
          </span>
          <div>
            <div class="student-course">
              {course.code} tutor <span class="muted">· {course.term}</span>
            </div>
            <button type="button" class="link-btn student-approved" onClick={() => setScopeOpen(true)}>
              Sources approved by {prof.short} · updated {lastUpdate}
            </button>
          </div>
        </div>
        <div class="student-top-right">
          {live ? <Status tone="live">On</Status> : <Status tone="muted">Paused</Status>}
          {chat.turns.length > 0 && (
            <button type="button" class="btn btn-ghost btn-sm" onClick={chat.clear}>
              Clear chat
            </button>
          )}
        </div>
      </header>

      <div class="student-scroll" ref={listRef}>
        <div class="student-col">
          {chat.turns.length === 0 && (
            <section class="overview" aria-label="About this tutor">
              <h1 class="overview-title">{course.title}</h1>
              <p class="overview-built">
                {approved.length ? `Built from ${countBy(approved)}, approved by ${prof.short}.` : `${prof.short} hasn’t approved any materials yet.`}
              </p>
              {isDemo() ? (
                <p class="overview-summary">
                  The course so far runs from <strong>measurement and the mole</strong> through <strong>stoichiometry</strong>, <strong>gases</strong> and{' '}
                  <strong>thermochemistry</strong> to this week’s <strong>equilibrium</strong> lectures and the first lecture on <strong>acids and pH</strong>.
                </p>
              ) : (
                <p class="overview-summary">
                  Ask about anything in {course.code}: a lecture you want explained again, where a topic was covered, or what the syllabus says.
                </p>
              )}
            </section>
          )}
          {/* The notice opens every chat, CS50-duck style, and comes back after Clear chat. */}
          <div class="turn-tutor notice">
            <p>
              I’m the {course.code} tutor. I answer only from materials <strong>{prof.short} approved</strong>, and I show where each answer comes from so you can
              rewatch the explanation. I’ll help you get unstuck on problem sets, but I won’t solve them or check your answers.{' '}
              {published ? (
                <strong>Questions asked here stay on this device.</strong>
              ) : (
                <strong>{prof.short} and the course staff can read the questions asked here.</strong>
              )}{' '}
              I can be wrong, so check the cited source.
            </p>
          </div>

          {!live && (
            <div class="paused" role="status">
              <IconPause size={18} />
              <div>
                <strong>{prof.short} has paused the tutor.</strong> Post your question on Ed, or come to office hours ({course.officeHours}).
              </div>
            </div>
          )}

          {chat.turns.map((t) =>
            t.role === 'user' ? (
              <div class="turn-user" key={t.id}>
                <p>{t.text}</p>
              </div>
            ) : (
              <TutorTurn
                key={t.id}
                t={t}
                onOpen={(sourceId, passageId) => setPanel({ sourceId, passageId })}
                actions={
                  <>
                    {t.result?.answer.outcome === 'not_covered' && (
                      <button
                        type="button"
                        class="btn btn-secondary btn-sm"
                        onClick={async () => {
                          const ok = await copyText(t.question)
                          toast(ok ? 'Question copied. Paste it into a new Ed thread.' : 'Copy your question, then post it on Ed.')
                        }}
                      >
                        <IconCopy size={14} /> Copy for Ed
                      </button>
                    )}
                    <button type="button" class="icon-btn" aria-label="Helpful" title="Helpful" onClick={() => toast('Thanks. Course staff see this rating.')}>
                      <IconThumb size={16} />
                    </button>
                    <button type="button" class="icon-btn" aria-label="Not helpful" title="Not helpful" onClick={() => setFlagFor(t.question)}>
                      <IconThumb size={16} down />
                    </button>
                  </>
                }
              />
            ),
          )}
        </div>
      </div>

      <div class="student-dock">
        <div class="student-col">
          <Composer
            id="student-q"
            busy={chat.busy}
            disabled={!live}
            onSend={chat.send}
            onStop={chat.stop}
            modeChip
            placeholder={live ? 'Ask about a lecture, a concept, or where you’re stuck…' : 'The tutor is paused'}
            suggestions={live ? suggestions : []}
            scope={
              <button type="button" class="scope" onClick={() => setScopeOpen(true)}>
                {plural(approved.length, 'source')}
              </button>
            }
          />
          <p class="student-foot">
            Answers use only {prof.short}’s approved materials · {published ? 'Questions stay on this device' : 'Course staff can see your questions'} · The tutor can be wrong, so
            check the source · Built with Lectern
          </p>
        </div>
      </div>

      <Panel
        open={!!panelSource}
        onClose={() => setPanel(null)}
        title={panelSource?.title ?? ''}
        sub={panelSource && panel?.passageId ? citeText(panelSource, panelSource.passages.find((p) => p.id === panel.passageId) ?? panelSource.passages[0]) : undefined}
      >
        {panelSource && <SourceView source={panelSource} focus={panel?.passageId} />}
      </Panel>

      <Panel open={scopeOpen} onClose={() => setScopeOpen(false)} title="What this tutor can use" sub={`${plural(approved.length, 'source')} approved by ${prof.short}`}>
        <ul class="scope-list">
          {approved.map((src) => {
            const Icon = kindIcon[src.kind] ?? kindIcon.upload
            return (
              <li key={src.id}>
                <button
                  type="button"
                  class="scope-item"
                  onClick={() => {
                    setScopeOpen(false)
                    setPanel({ sourceId: src.id })
                  }}
                >
                  <Icon size={16} />
                  <span class="scope-title">{src.title}</span>
                  <span class="muted">{src.meta}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <p class="muted small">Problem sets that are still open are not on this list. The tutor uses them only to recognize questions it should not solve.</p>
      </Panel>

      <FlagSheet
        question={flagFor}
        onClose={() => setFlagFor(null)}
        onPick={(why) => {
          const id = flagFor ? lastEntryFor.current.get(flagFor) : null
          if (id)
            update(
              (st) => {
                st.flags[id] = true
              },
              { kind: 'flagged', detail: `A student marked an answer “${why}”` },
            )
          setFlagFor(null)
          toast('Sent to course staff. Thanks.')
        }}
      />
    </div>
  )
}

function FlagSheet({ question, onClose, onPick }: { question: string | null; onClose: () => void; onPick: (why: string) => void }) {
  return (
    <Panel open={!!question} onClose={onClose} title="What was wrong with this answer?" sub="Your note goes to the course staff with the answer." width={420}>
      <div class="flag-options">
        {['Didn’t match lecture', 'Wrong source', 'Gave away too much', 'Didn’t help me'].map((w) => (
          <button key={w} type="button" class="btn btn-secondary" onClick={() => onPick(w)}>
            {w}
          </button>
        ))}
      </div>
    </Panel>
  )
}
