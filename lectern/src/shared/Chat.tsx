import type { ComponentChildren } from 'preact'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import type { Hit } from '../engine/search'
import { ask, type TutorContext, type TutorResult } from '../engine/tutor'
import { plain } from '../lib/md'
import { IconCopy, IconLock, IconSend, IconStop, IconInfo } from '../ui/icons'
import { cx, Popover, toast, copyText } from '../ui/kit'
import { AnswerBody, type OpenSource } from './Answer'
import { course } from '../app/context'

export type Turn =
  | { id: string; role: 'user'; text: string }
  | {
      id: string
      role: 'tutor'
      question: string
      state: 'reading' | 'writing' | 'done' | 'error'
      read: Hit[]
      partial: string
      result?: TutorResult
      error?: string
    }

const uid = () => Math.random().toString(36).slice(2, 9)

const reading = () => ['Searching lecture transcripts', `Reading ${course.professor.short}’s materials`, 'Checking the slides', 'Looking through the syllabus']

export function useChat(ctx: TutorContext, onAnswered?: (q: string, r: TutorResult) => void) {
  const [turns, setTurns] = useState<Turn[]>([])
  const ctl = useRef<AbortController | null>(null)
  const busy = turns.some((t) => t.role === 'tutor' && (t.state === 'reading' || t.state === 'writing'))

  const patch = (id: string, p: Partial<Extract<Turn, { role: 'tutor' }>>) =>
    setTurns((ts) => ts.map((t) => (t.id === id && t.role === 'tutor' ? { ...t, ...p } : t)))

  async function send(text: string, opts: { fresh?: boolean } = {}) {
    const q = text.trim()
    if (!q || busy) return
    const tid = uid()
    type Msg = { role: 'user' | 'assistant'; content: string }
    const history: Msg[] = []
    for (const t of turns) {
      if (t.role === 'user') history.push({ role: 'user', content: t.text })
      else if (t.result) history.push({ role: 'assistant', content: plain(t.result.answer.body) })
    }
    setTurns((ts) => [...ts, { id: uid(), role: 'user', text: q }, { id: tid, role: 'tutor', question: q, state: 'reading', read: [], partial: '' }])
    ctl.current = new AbortController()
    try {
      const result = await ask(q, ctx, {
        history,
        fresh: opts.fresh,
        signal: ctl.current.signal,
        onRead: (read) => patch(tid, { read }),
        onText: (partial) => patch(tid, { partial, state: 'writing' }),
      })
      patch(tid, { state: 'done', result, read: result.read })
      onAnswered?.(q, result)
    } catch (e) {
      const err = e as { code?: string }
      if (err?.code === 'cancelled') {
        setTurns((ts) => ts.map((t) => (t.id === tid && t.role === 'tutor' ? { ...t, state: 'error', error: 'Stopped.' } : t)))
      } else {
        patch(tid, { state: 'error', error: 'Something went wrong while answering. Try asking again.' })
      }
    } finally {
      ctl.current = null
    }
  }

  return {
    turns,
    busy,
    send,
    stop: () => ctl.current?.abort(),
    clear: () => setTurns([]),
  }
}

function ReadingLine({ read }: { read: Hit[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => n + 1), 1400)
    return () => clearInterval(t)
  }, [])
  const names = [...new Set(read.map((h) => h.source.title.split('·')[0].trim()))]
  const text = names.length ? `Reading ${names.slice(0, 3).join(', ')}${names.length > 3 ? ` and ${names.length - 3} more` : ''}` : reading()[i % reading().length]
  return (
    <div class="reading" aria-live="polite">
      <span class="reading-bar" />
      <span>{text}…</span>
    </div>
  )
}

export function searchedSummary(read: Hit[]) {
  const by = new Map<string, Set<string>>()
  for (const h of read) {
    const k = h.source.kind
    const s = by.get(k) ?? new Set()
    s.add(h.source.id)
    by.set(k, s)
  }
  const word: Record<string, [string, string]> = {
    lecture: ['lecture', 'lectures'],
    slides: ['slide deck', 'slide decks'],
    syllabus: ['syllabus', 'syllabus'],
    ed: ['set of Ed answers', 'sets of Ed answers'],
    exam: ['practice exam', 'practice exams'],
    pset: ['problem set', 'problem sets'],
    upload: ['added file', 'added files'],
  }
  const parts = [...by].map(([k, s]) => `${s.size} ${word[k]?.[s.size === 1 ? 0 : 1] ?? k}`)
  return parts.length ? `Read ${parts.join(', ')}` : ''
}

const CALLOUT: Record<string, string> = {
  declined_pset: 'Problem set question: hints only',
  sent_to_tfs: 'Handled by course staff',
  not_covered: 'Not in the approved materials',
}

export function TutorTurn({ t, onOpen, actions, showMethod }: { t: Extract<Turn, { role: 'tutor' }>; onOpen: OpenSource; actions?: ComponentChildren; showMethod?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  if (t.state === 'reading') return <ReadingLine read={t.read} />
  if (t.state === 'error' && !t.partial) return <p class="turn-error">{t.error}</p>
  const body = t.result?.answer.body ?? t.partial
  const outcome = t.result?.answer.outcome
  const method = t.result?.method
  return (
    <div class="turn-tutor" ref={ref}>
      {outcome && CALLOUT[outcome] && <div class={cx('callout', `callout-${outcome}`)}>{CALLOUT[outcome]}</div>}
      <AnswerBody body={body} onOpen={onOpen} showSources={t.state === 'done'} />
      {t.state === 'writing' && <span class="caret" aria-hidden="true" />}
      {t.result?.interrupted && <p class="turn-note">The answer was cut off. Ask again to get the rest.</p>}
      {t.state === 'done' && (
        <div class="turn-foot">
          <span class="turn-meta">
            {searchedSummary(t.read)}
            {showMethod && method === 'quoted' && ' · Quoted directly from the materials'}
            {method === 'corrected' && ` · Written by ${course.professor.short}`}
          </span>
          <span class="turn-actions">
            <button
              type="button"
              class="icon-btn"
              aria-label="Copy answer"
              title="Copy"
              onClick={async () => {
                const ok = await copyText(plain(body), ref.current?.querySelector('.prose'))
                toast(ok ? 'Answer copied' : 'Select the text and copy it')
              }}
            >
              <IconCopy size={16} />
            </button>
            {actions}
          </span>
        </div>
      )}
    </div>
  )
}

export function Composer(props: {
  onSend: (q: string) => void
  onStop: () => void
  busy: boolean
  disabled?: boolean
  placeholder: string
  suggestions?: string[]
  scope?: ComponentChildren
  modeChip?: boolean
  id: string
}) {
  const [text, setText] = useState('')
  const ta = useRef<HTMLTextAreaElement>(null)
  const chipRef = useRef<HTMLButtonElement>(null)
  const [modeOpen, setModeOpen] = useState(false)
  useEffect(() => {
    const el = ta.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, window.innerHeight * 0.25)}px`
  }, [text])
  const submit = () => {
    if (!text.trim() || props.busy || props.disabled) return
    props.onSend(text)
    setText('')
  }
  return (
    <form
      class={cx('composer', props.disabled && 'is-disabled')}
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <label class="sr-only" for={props.id}>
        Your question
      </label>
      <textarea
        id={props.id}
        ref={ta}
        rows={1}
        value={text}
        disabled={props.disabled}
        placeholder={props.placeholder}
        onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
            e.preventDefault()
            submit()
          }
        }}
      />
      {props.suggestions && props.suggestions.length > 0 && !text && (
        <div class="suggestions" aria-label="Suggested questions">
          {props.suggestions.map((s) => (
            <button key={s} type="button" class="suggestion" disabled={props.busy || props.disabled} onClick={() => props.onSend(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div class="composer-bar">
        {props.modeChip && (
          <>
            <button type="button" class="mode-chip" ref={chipRef} onClick={() => setModeOpen((v) => !v)} aria-expanded={modeOpen}>
              <IconLock size={14} />
              Hints, not solutions
            </button>
            <Popover anchor={chipRef.current} open={modeOpen} onClose={() => setModeOpen(false)} class="mini-card" place="above">
              <p>
                <IconInfo size={15} /> {course.professor.short} set this tutor to explain ideas and point to lectures. It won’t work or check current problem-set questions.
              </p>
            </Popover>
          </>
        )}
        <span class="composer-spacer" />
        {props.scope}
        {props.busy ? (
          <button type="button" class="send-btn is-stop" aria-label="Stop answering" onClick={props.onStop}>
            <IconStop size={16} />
          </button>
        ) : (
          <button type="submit" class="send-btn" aria-label="Send" disabled={!text.trim() || props.disabled}>
            <IconSend size={18} />
          </button>
        )}
      </div>
    </form>
  )
}

/** Follow-up questions drawn from the course's own question bank, matched to the last topic asked. */
export function useSuggestions(lastTopic: string | null, asked: string[], seed: string[]) {
  return useMemo(() => {
    if (!lastTopic) return seed
    const pool = [...course.sampleLog, ...course.testQuestions]
      .filter((q) => q.topic === lastTopic && q.answer.outcome === 'answered' && !asked.includes(q.text))
      .map((q) => q.text)
    return pool.slice(0, 3).length ? pool.slice(0, 3) : seed
  }, [lastTopic, asked.length])
}
