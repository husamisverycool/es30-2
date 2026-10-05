import { useEffect, useRef, useState } from 'preact/hooks'
import { course, prof, useTutorContext, allSources } from '../app/context'
import { update, useStore } from '../state/store'
import { citedIds, questionKey, type TutorResult } from '../engine/tutor'
import { RULES } from '../engine/rules'
import { plain } from '../lib/md'
import { Composer, TutorTurn, useChat, type Turn } from '../shared/Chat'
import { SourceView } from '../shared/SourceView'
import { citeText } from '../shared/Answer'
import { IconCheck, IconPencil, IconChevron } from '../ui/icons'
import { Button, Panel, Status, cx, toast } from '../ui/kit'
import { PageHead } from './Console'

const METHOD: Record<string, string> = {
  prepared: 'Prepared during setup from your approved materials, and checked against them.',
  corrected: 'Your own wording. The tutor gives this answer to the same question and close variations.',
  claude: 'Written by Claude from the passages below, under your rules. Claude saw only these passages.',
  quoted: 'Quoted directly from the passages below. Full written answers appear for viewers signed in to Claude.',
  guard: 'Decided by a rule before any model was involved.',
}

const OUTCOME_RULE: Record<string, string | undefined> = {
  declined_pset: 'no-pset',
  sent_to_tfs: 'tfs',
  not_covered: 'sources-only',
}

export function WhyThisAnswer({ t }: { t: Extract<Turn, { role: 'tutor' }> }) {
  const [open, setOpen] = useState(false)
  if (!t.result) return null
  const r = t.result
  const ruleId = OUTCOME_RULE[r.answer.outcome]
  const rule = RULES.find((x) => x.id === ruleId)
  const cited = new Set(citedIds(r.answer.body))
  return (
    <div class="why">
      <button type="button" class="why-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <IconChevron size={14} dir={open ? 'down' : 'right'} />
        Why this answer
      </button>
      {open && (
        <div class="why-body">
          <p>{METHOD[r.method]}</p>
          {rule && (
            <p>
              Rule applied: <strong>{rule.title}</strong>
            </p>
          )}
          {r.read.length > 0 && (
            <>
              <p class="why-label">Passages it read</p>
              <ol class="why-list">
                {r.read.slice(0, 6).map((h) => (
                  <li key={h.passage.id} class={cx(cited.has(h.passage.id) && 'is-cited')}>
                    <span>{citeText(h.source, h.passage)}</span>
                    <span class="muted">{cited.has(h.passage.id) ? 'cited' : 'read'}</span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/** Correction editor: her words replace the tutor's for this question and close variants. */
export function CorrectionPanel({ question, result, onClose }: { question: string | null; result: TutorResult | null; onClose: () => void }) {
  const [text, setText] = useState('')
  const [keep, setKeep] = useState<string[]>([])
  const ids = result ? [...new Set(citedIds(result.answer.body))] : []
  const s = useStore()
  const map = new Map(allSources(s).flatMap((src) => src.passages.map((p) => [p.id, { source: src, passage: p }] as const)))
  useEffect(() => {
    if (!result) return
    setText(plain(result.answer.body).trim())
    setKeep(ids)
  }, [question])
  return (
    <Panel open={!!question} onClose={onClose} title="Correct this answer" sub="Students who ask this, or something close to it, get your version." width={560}>
      {question && (
        <form
          class="correct-form"
          onSubmit={(e) => {
            e.preventDefault()
            const paras = text.trim().split(/\n\s*\n/)
            if (keep.length) paras[paras.length - 1] += ' ' + keep.map((id) => `[[${id}]]`).join(' ')
            const body = paras.join('\n\n')
            update(
              (st) => {
                st.corrections = [...st.corrections.filter((c) => questionKey(c.question) !== questionKey(question)), { question, body, at: new Date().toISOString() }]
                st.ratings[questionKey(question)] = 'good'
              },
              { kind: 'corrected', detail: `Corrected the answer to “${question.slice(0, 60)}${question.length > 60 ? '…' : ''}”` },
            )
            toast('Saved. The tutor will use your wording.')
            onClose()
          }}
        >
          <p class="correct-q">“{question}”</p>
          <div class="field">
            <label class="field-label" for="correct-text">
              Your answer
            </label>
            <textarea id="correct-text" class="textarea" rows={10} value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} />
            <span class="field-help">Write it the way you would on Ed. Blank lines start new paragraphs.</span>
          </div>
          {ids.length > 0 && (
            <fieldset class="field keep">
              <legend class="field-label">Keep these citations</legend>
              {ids.map((id) => {
                const hit = map.get(id)
                if (!hit) return null
                return (
                  <label key={id} class="keep-row">
                    <input type="checkbox" class="checkbox" checked={keep.includes(id)} onChange={() => setKeep((k) => (k.includes(id) ? k.filter((x) => x !== id) : [...k, id]))} />
                    {citeText(hit.source, hit.passage)}
                  </label>
                )
              })}
            </fieldset>
          )}
          <div class="form-actions">
            <Button type="submit" variant="primary" disabled={!text.trim()}>
              Save correction
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Panel>
  )
}

function PreviewThread({ chat, onOpen, onCorrect }: { chat: ReturnType<typeof useChat>; onOpen: (s: string, p?: string) => void; onCorrect: (q: string, r: TutorResult) => void }) {
  const s = useStore()
  return (
    <>
      {chat.turns.map((t) =>
        t.role === 'user' ? (
          <div class="turn-user" key={t.id}>
            <p>{t.text}</p>
          </div>
        ) : (
          <div key={t.id} class="preview-turn">
            <TutorTurn
              t={t}
              showMethod
              onOpen={onOpen}
              actions={
                t.result && (
                  <>
                    <Button
                      size="sm"
                      variant={s.ratings[questionKey(t.question)] === 'good' ? 'quiet' : 'ghost'}
                      icon={<IconCheck size={15} />}
                      onClick={() =>
                        update(
                          (st) => {
                            st.ratings[questionKey(t.question)] = 'good'
                          },
                          { kind: 'rated', detail: `Marked an answer as right: “${t.question.slice(0, 50)}${t.question.length > 50 ? '…' : ''}”` },
                        )
                      }
                    >
                      Sounds right
                    </Button>
                    <Button size="sm" variant="ghost" icon={<IconPencil size={15} />} onClick={() => onCorrect(t.question, t.result!)}>
                      Not how I’d say it
                    </Button>
                  </>
                )
              }
            />
            <WhyThisAnswer t={t} />
          </div>
        ),
      )}
    </>
  )
}

/** Small panel that runs one question, used by "Try it" on the Rules page. */
export function TryPanel({ question, onClose }: { question: string | null; onClose: () => void }) {
  const ctx = useTutorContext()
  const chat = useChat(ctx, () => update((st) => void (st.previewCount += 1)))
  const [src, setSrc] = useState<{ s: string; p?: string } | null>(null)
  const [fix, setFix] = useState<{ q: string; r: TutorResult } | null>(null)
  const started = useRef<string | null>(null)
  useEffect(() => {
    if (question && started.current !== question) {
      started.current = question
      chat.clear()
      setTimeout(() => chat.send(question), 0)
    }
    if (!question) started.current = null
  }, [question])
  const all = allSources(useStore())
  const source = src ? all.find((x) => x.id === src.s) : null
  return (
    <>
      <Panel open={!!question} onClose={onClose} title="Try it" sub="Preview only. Students don’t see this." width={560}>
        <div class="try-thread">
          <PreviewThread chat={chat} onOpen={(s, p) => setSrc({ s, p })} onCorrect={(q, r) => setFix({ q, r })} />
        </div>
        <div class="try-composer">
          <Composer id="try-q" busy={chat.busy} onSend={chat.send} onStop={chat.stop} placeholder="Ask a follow-up as a student would" />
        </div>
      </Panel>
      <Panel open={!!source} onClose={() => setSrc(null)} title={source?.title ?? ''} width={520}>
        {source && <SourceView source={source} focus={src?.p} />}
      </Panel>
      <CorrectionPanel question={fix?.q ?? null} result={fix?.r ?? null} onClose={() => setFix(null)} />
    </>
  )
}

export function Preview() {
  const s = useStore()
  const ctx = useTutorContext()
  const chat = useChat(ctx, () => update((st) => void (st.previewCount += 1), s.previewCount === 0 ? { kind: 'tested', detail: 'Started testing the tutor in Preview' } : undefined))
  const [src, setSrc] = useState<{ s: string; p?: string } | null>(null)
  const [fix, setFix] = useState<{ q: string; r: TutorResult } | null>(null)
  const [queue, setQueue] = useState<string[]>([])
  const listRef = useRef<HTMLDivElement>(null)
  const all = allSources(s)
  const source = src ? all.find((x) => x.id === src.s) : null

  // Batch run: send the next queued question when the tutor is free.
  useEffect(() => {
    if (!chat.busy && queue.length) {
      const [next, ...rest] = queue
      setQueue(rest)
      chat.send(next)
    }
  }, [chat.busy, queue.length])
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [chat.turns.length])

  const asked = new Set(chat.turns.filter((t) => t.role === 'user').map((t) => questionKey((t as { text: string }).text)))
  const rated = course.testQuestions.filter((q) => s.ratings[questionKey(q.text)] === 'good').length
  const corrected = course.testQuestions.filter((q) => s.corrections.some((c) => questionKey(c.question) === questionKey(q.text))).length

  return (
    <>
      <PageHead
        title="Preview"
        sub="Ask what your students ask. Nothing you try here reaches students or the question log."
        actions={
          course.testQuestions.length > 0 && (
            <Button variant="secondary" disabled={chat.busy || queue.length > 0} onClick={() => setQueue(course.testQuestions.map((q) => q.text).filter((q) => !asked.has(questionKey(q))))}>
              Ask all {course.testQuestions.length}
            </Button>
          )
        }
      />
      <div class={cx('preview-grid', course.testQuestions.length === 0 && 'is-single')}>
        {course.testQuestions.length > 0 && (
        <aside class="ed-list" aria-label="Questions from your Ed history">
          <div class="ed-list-head">
            <h2 class="section-title">From your Ed history</h2>
            <span class="muted small tnum">
              {rated} marked right{corrected ? ` · ${corrected} corrected` : ''}
            </span>
          </div>
          <ul>
            {course.testQuestions.map((q) => {
              const k = questionKey(q.text)
              const isCorrected = s.corrections.some((c) => questionKey(c.question) === k)
              return (
                <li key={q.id}>
                  <button type="button" class={cx('ed-q', asked.has(k) && 'is-asked')} disabled={chat.busy} onClick={() => chat.send(q.text)}>
                    <span class="ed-q-text">{q.text}</span>
                    <span class="ed-q-meta">
                      <span>{q.from}</span>
                      {isCorrected ? (
                        <Status tone="info">Your wording</Status>
                      ) : s.ratings[k] === 'good' ? (
                        <Status tone="good">Right</Status>
                      ) : asked.has(k) ? (
                        <Status tone="muted">Asked</Status>
                      ) : null}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>
        )}
        <section class="preview-chat" aria-label="Test conversation">
          <div class="preview-scroll" ref={listRef}>
            {chat.turns.length === 0 ? (
              <div class="preview-empty">
                <h2 class="section-title">Ask it anything a student would</h2>
                <p class="muted">
                  {course.testQuestions.length > 0 ? 'Pick a question from your Ed history, or type your own.' : 'Type a question a student asked you this week.'} Try asking for a
                  problem-set answer to see how it declines. Each answer shows where it came from, and you can rewrite any answer in your own words.
                </p>
              </div>
            ) : (
              <PreviewThread chat={chat} onOpen={(s, p) => setSrc({ s, p })} onCorrect={(q, r) => setFix({ q, r })} />
            )}
          </div>
          <div class="preview-dock">
            <Composer id="preview-q" busy={chat.busy} onSend={chat.send} onStop={() => (setQueue([]), chat.stop())} placeholder="Ask as a student would…" />
            <p class="muted small preview-foot">
              Testing as a student in {course.code}. {queue.length > 0 ? `${queue.length} more queued.` : `${prof.short}’s rules apply here exactly as they will for students.`}
            </p>
          </div>
        </section>
      </div>
      <Panel open={!!source} onClose={() => setSrc(null)} title={source?.title ?? ''} width={520}>
        {source && <SourceView source={source} focus={src?.p} hidden={source.mode === 'recognize'} />}
      </Panel>
      <CorrectionPanel question={fix?.q ?? null} result={fix?.r ?? null} onClose={() => setFix(null)} />
    </>
  )
}
