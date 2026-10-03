import { useEffect, useRef } from 'preact/hooks'
import type { Source } from '../data/types'
import { fmtDate } from '../ui/kit'

/** A source opened in the side panel: transcript, slides or document text, scrolled to the cited passage. */
export function SourceView({ source, focus, hidden }: { source: Source; focus?: string; hidden?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!focus) return
    const el = ref.current?.querySelector<HTMLElement>(`[data-pid="${CSS.escape(focus)}"]`)
    el?.scrollIntoView({ block: 'center' })
  }, [focus, source.id])

  if (hidden) {
    return (
      <div class="srcview-hidden">
        <p>
          This problem set is used only so the tutor can recognize its questions. Students never see its text, and the tutor never quotes it.
        </p>
        <p class="muted">{source.passages.length} problems indexed.</p>
      </div>
    )
  }

  const timed = source.kind === 'lecture' || source.passages.some((p) => p.seconds != null)
  return (
    <div class={`srcview srcview-${source.kind}`} ref={ref}>
      <div class="srcview-meta">
        {source.date && <span>{fmtDate(source.date)}</span>}
        <span>{source.meta}</span>
        <span>{source.origin}</span>
      </div>
      {timed && <p class="srcview-note">Transcript from the course recording. Timestamps match the video on Canvas.</p>}
      <ol class="srcview-list">
        {source.passages.map((p) => (
          <li key={p.id} data-pid={p.id} class={p.id === focus ? 'is-focus' : undefined}>
            <span class={timed ? 'srcview-time' : 'srcview-loc'}>{p.loc}</span>
            <p>{p.text}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
