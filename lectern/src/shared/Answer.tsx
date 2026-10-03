import type { ComponentChildren } from 'preact'
import { useRef, useState } from 'preact/hooks'
import type { Passage, Source } from '../data/types'
import { citationOrder, parse, type Block, type Inline } from '../lib/md'
import { sourceShort } from '../engine/tutor'
import { IconPlay, kindIcon } from '../ui/icons'
import { Popover } from '../ui/kit'
import { course, usePassageMap } from '../app/context'

export type OpenSource = (sourceId: string, passageId?: string) => void

type PMap = Map<string, { passage: Passage; source: Source }>

export function citeText(source: Source, passage: Passage) {
  if (source.kind === 'lecture') return `${sourceShort(source)} · ${passage.loc}`
  if (source.kind === 'slides') return `${source.title.replace('Slides · ', 'Slides, ')} · ${passage.loc.toLowerCase()}`
  if (source.kind === 'ed') return `${course.professor.short} on Ed · ${passage.loc.replace(/^Ed\s*/, '')}`
  return `${sourceShort(source)} · ${passage.loc}`
}

function Chip({ n, id, map, onOpen }: { n: number; id: string; map: PMap; onOpen?: OpenSource }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const hit = map.get(id)
  if (!hit) return null
  const show = () => {
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(true), 120)
  }
  const hide = () => {
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(false), 160)
  }
  return (
    <>
      {' '}
      <button
        ref={ref}
        type="button"
        class="cite"
        aria-label={`${n}: ${citeText(hit.source, hit.passage)}`}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={() => setOpen(true)}
        onBlur={hide}
        onClick={() => {
          setOpen(false)
          onOpen?.(hit.source.id, hit.passage.id)
        }}
      >
        {n}
      </button>
      <Popover anchor={ref.current} open={open} onClose={() => setOpen(false)} class="cite-card">
        <div onMouseEnter={() => clearTimeout(timer.current)} onMouseLeave={hide}>
          <div class="cite-card-head">{citeText(hit.source, hit.passage)}</div>
          <p class="cite-card-quote">{hit.passage.text}</p>
          <div class="cite-card-foot">
            <span class="cite-card-src">{hit.source.title}</span>
            <span class="cite-card-approved">Approved by {course.professor.short}</span>
            {onOpen && (
              <button type="button" class="link-btn" onClick={() => onOpen(hit.source.id, hit.passage.id)}>
                {hit.source.kind === 'lecture' ? (
                  <>
                    <IconPlay size={14} /> Open at {hit.passage.loc}
                  </>
                ) : (
                  <>Open {hit.passage.loc.toLowerCase()}</>
                )}
              </button>
            )}
          </div>
        </div>
      </Popover>
    </>
  )
}

function Inlines({ c, order, map, onOpen }: { c: Inline[]; order: string[]; map: PMap; onOpen?: OpenSource }) {
  return (
    <>
      {c.map((x, i) =>
        x.t === 'text' ? (
          x.v
        ) : x.t === 'b' ? (
          <strong key={i}>{x.v}</strong>
        ) : (
          <Chip key={i} n={order.indexOf(x.id) + 1} id={x.id} map={map} onOpen={onOpen} />
        ),
      )}
    </>
  )
}

function Blocks({ blocks, order, map, onOpen }: { blocks: Block[]; order: string[]; map: PMap; onOpen?: OpenSource }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === 'p') return <p key={i}><Inlines c={b.c} order={order} map={map} onOpen={onOpen} /></p>
        if (b.t === 'quote') return <blockquote key={i}><Inlines c={b.c} order={order} map={map} onOpen={onOpen} /></blockquote>
        const Tag = b.t === 'ul' ? 'ul' : 'ol'
        return (
          <Tag key={i}>
            {b.items.map((it, j) => (
              <li key={j}><Inlines c={it} order={order} map={map} onOpen={onOpen} /></li>
            ))}
          </Tag>
        )
      })}
    </>
  )
}

/** Tutor answer prose with numbered citation chips and a labelled sources row underneath. */
export function AnswerBody({ body, onOpen, showSources = true, extra }: { body: string; onOpen?: OpenSource; showSources?: boolean; extra?: ComponentChildren }) {
  const map = usePassageMap()
  const order = citationOrder(body).filter((id) => map.has(id))
  return (
    <div class="answer">
      <div class="prose">
        <Blocks blocks={parse(body)} order={order} map={map} onOpen={onOpen} />
      </div>
      {showSources && order.length > 0 && (
        <ol class="sources-row" aria-label="Sources">
          {order.map((id, i) => {
            const hit = map.get(id)!
            const Icon = kindIcon[hit.source.kind] ?? kindIcon.upload
            return (
              <li key={id}>
                <button type="button" class="source-pill" onClick={() => onOpen?.(hit.source.id, id)} disabled={!onOpen}>
                  <span class="source-pill-n">{i + 1}</span>
                  <Icon size={15} />
                  <span>{citeText(hit.source, hit.passage)}</span>
                </button>
              </li>
            )
          })}
        </ol>
      )}
      {extra}
    </div>
  )
}
