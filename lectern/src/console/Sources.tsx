import { useMemo, useRef, useState } from 'preact/hooks'
import { course, allSources, statusOf, isDemo } from '../app/context'
import type { ReviewStatus, Source, SourceKind } from '../data/types'
import { getState, update, useStore } from '../state/store'
import { citedIds } from '../engine/tutor'
import { ACCEPT, guessKind, sourceFromFile, sourceFromPaste } from '../engine/ingest'
import { SourceView } from '../shared/SourceView'
import { IconTrash, IconUpload, kindIcon } from '../ui/icons'
import { Button, Dialog, Panel, Status, Switch, cx, fmtDate, toast } from '../ui/kit'
import { PageHead } from './Console'

const KINDS: { id: SourceKind | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'lecture', label: 'Lectures' },
  { id: 'slides', label: 'Slides' },
  { id: 'syllabus', label: 'Syllabus' },
  { id: 'pset', label: 'Problem sets' },
  { id: 'exam', label: 'Exams' },
  { id: 'ed', label: 'Ed' },
  { id: 'upload', label: 'Added by you' },
]

const STATUS_WORD: Record<ReviewStatus, string> = { review: 'Needs review', approved: 'Approved', excluded: 'Left out' }
const STATUS_TONE = { review: 'warn', approved: 'good', excluded: 'muted' } as const

export function setStatus(ids: string[], status: ReviewStatus | null) {
  const all = allSources(getState())
  const names = ids.map((id) => all.find((x) => x.id === id)?.title ?? id)
  const verb = status === 'approved' ? 'Approved' : status === 'excluded' ? 'Left out' : 'Reset'
  update(
    (s) => {
      for (const id of ids) {
        if (status) s.statuses[id] = status
        else delete s.statuses[id]
      }
    },
    {
      kind: status === 'approved' ? 'approved' : status === 'excluded' ? 'excluded' : 'reset-source',
      detail: names.length === 1 ? `${verb} ${names[0]}` : `${verb} ${names.length} sources`,
    },
  )
}

function usageCounts(log: { answer: { body: string } }[]) {
  const passageToSource = new Map<string, string>()
  for (const s of course.sources) for (const p of s.passages) passageToSource.set(p.id, s.id)
  const counts = new Map<string, number>()
  for (const q of [...course.testQuestions, ...course.sampleLog, ...log]) {
    const seen = new Set<string>()
    for (const id of citedIds(q.answer.body)) {
      const src = passageToSource.get(id)
      if (src && !seen.has(src)) {
        seen.add(src)
        counts.set(src, (counts.get(src) ?? 0) + 1)
      }
    }
  }
  return counts
}

export function Sources() {
  const s = useStore()
  const [kind, setKind] = useState<SourceKind | 'all'>('all')
  const [statusF, setStatusF] = useState<ReviewStatus | 'any'>('any')
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [accept, setAccept] = useState(false)
  const all = allSources(s)
  const usage = useMemo(() => usageCounts(s.log), [s.log.length])

  const rows = all.filter((x) => (kind === 'all' || x.kind === kind) && (statusF === 'any' || statusOf(s, x) === statusF))
  const decided = all.filter((x) => statusOf(s, x) !== 'review').length
  const approved = all.filter((x) => statusOf(s, x) === 'approved').length
  const excluded = all.filter((x) => statusOf(s, x) === 'excluded').length
  const undecided = all.filter((x) => statusOf(s, x) === 'review')
  const recApprove = undecided.filter((x) => x.proposed === 'approved')
  const recExclude = undecided.filter((x) => x.proposed === 'excluded')
  const openSrc = open ? all.find((x) => x.id === open) : null

  const toggleSel = (id: string) =>
    setSel((cur) => {
      const n = new Set(cur)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  const allVisibleSelected = rows.length > 0 && rows.every((r) => sel.has(r.id))

  return (
    <>
      <PageHead
        title="Sources"
        sub={isDemo() ? 'The tutor can use only the sources you approve. Lectern recommends a decision for each one; the decision is yours.' : 'The tutor can use only the sources listed here as approved. Anything you add is approved; leave out any source and it stops being used straight away.'}
        actions={
          <>
            <Button variant="secondary" icon={<IconUpload size={16} />} onClick={() => setAdding(true)}>
              Add a source
            </Button>
            {undecided.length > 0 && (
              <Button variant="primary" onClick={() => setAccept(true)}>
                Accept recommendations
              </Button>
            )}
          </>
        }
      />

      {all.length === 0 ? (
        <div class="empty sources-empty">
          <h2 class="section-title">Add your course materials</h2>
          <p class="muted">
            Start with your syllabus and two or three lectures. Caption files from Panopto, Zoom or Canvas Studio (.vtt or .srt) keep their timestamps, so the tutor can point
            students to the exact minute. PDFs of slides, problem sets and notes work too. Nothing leaves this browser.
          </p>
          <Button variant="primary" icon={<IconUpload size={16} />} onClick={() => setAdding(true)}>
            Add a source
          </Button>
        </div>
      ) : (
        <>
      <div class="coverage">
        <div class="coverage-text tnum">
          <strong>
            {decided} of {all.length} reviewed
          </strong>
          <span class="muted">
            {approved} approved · {excluded} left out
          </span>
        </div>
        <div class="coverage-bar" role="progressbar" aria-valuemin={0} aria-valuemax={all.length} aria-valuenow={decided} aria-label="Sources reviewed">
          <span class="coverage-approved" style={{ width: `${(approved / Math.max(1, all.length)) * 100}%` }} />
          <span class="coverage-excluded" style={{ width: `${(excluded / Math.max(1, all.length)) * 100}%` }} />
        </div>
      </div>

      <div class="toolbar">
        <div class="tabs" role="tablist" aria-label="Source type">
          {KINDS.filter((k) => k.id === 'all' || all.some((x) => x.kind === k.id)).map((k) => {
            const n = k.id === 'all' ? all.length : all.filter((x) => x.kind === k.id).length
            return (
              <button key={k.id} type="button" role="tab" aria-selected={kind === k.id} class={cx('tab', kind === k.id && 'is-active')} onClick={() => setKind(k.id)}>
                {k.label} <span class="tab-n tnum">{n}</span>
              </button>
            )
          })}
        </div>
        <label class="sr-only" for="status-filter">
          Status
        </label>
        <select id="status-filter" class="select select-sm" value={statusF} onChange={(e) => setStatusF((e.target as HTMLSelectElement).value as ReviewStatus | 'any')}>
          <option value="any">Any status</option>
          <option value="review">Needs review</option>
          <option value="approved">Approved</option>
          <option value="excluded">Left out</option>
        </select>
      </div>

      <div class="table-wrap">
        <table class="table sources-table">
          <thead>
            <tr>
              <th class="col-check">
                <input
                  type="checkbox"
                  class="checkbox"
                  aria-label="Select all shown"
                  checked={allVisibleSelected}
                  onChange={() => setSel(allVisibleSelected ? new Set() : new Set(rows.map((r) => r.id)))}
                />
              </th>
              <th>Source</th>
              <th class="col-num">Used in</th>
              <th class="col-status">Status</th>
              <th class="col-action">
                <span class="sr-only">Decision</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((src) => (
              <SourceRow key={src.id} src={src} status={statusOf(s, src)} uses={usage.get(src.id) ?? 0} selected={sel.has(src.id)} onSelect={() => toggleSel(src.id)} onOpen={() => setOpen(src.id)} />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} class="empty-row">
                  No sources match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

        </>
      )}

      {sel.size > 0 && (
        <div class="bulk-bar" role="toolbar" aria-label="Selected sources">
          <span class="bulk-count tnum">{sel.size} selected</span>
          <Button size="sm" variant="ghost" onClick={() => (setStatus([...sel], 'approved'), setSel(new Set()))}>
            Approve
          </Button>
          <Button size="sm" variant="ghost" onClick={() => (setStatus([...sel], 'excluded'), setSel(new Set()))}>
            Leave out
          </Button>
          <span class="bulk-sep" />
          <Button size="sm" variant="ghost" onClick={() => setSel(new Set())}>
            Cancel
          </Button>
        </div>
      )}

      <Panel
        open={!!openSrc}
        onClose={() => setOpen(null)}
        width={560}
        title={openSrc?.title ?? ''}
        sub={openSrc ? <Status tone={STATUS_TONE[statusOf(s, openSrc)]}>{STATUS_WORD[statusOf(s, openSrc)]}</Status> : null}
      >
        {openSrc && (
          <div class="src-panel">
            {openSrc.note && <p class="src-note">{openSrc.note}</p>}
            <div class="src-panel-actions">
              <Button variant={statusOf(s, openSrc) === 'approved' ? 'quiet' : 'primary'} onClick={() => setStatus([openSrc.id], 'approved')} disabled={statusOf(s, openSrc) === 'approved'}>
                {statusOf(s, openSrc) === 'approved' ? 'Approved' : 'Approve'}
              </Button>
              <Button variant="secondary" onClick={() => setStatus([openSrc.id], 'excluded')} disabled={statusOf(s, openSrc) === 'excluded'}>
                {statusOf(s, openSrc) === 'excluded' ? 'Left out' : 'Leave out'}
              </Button>
              {openSrc.origin === 'Added by you' && (
                <Button
                  variant="danger"
                  icon={<IconTrash size={16} />}
                  onClick={() => {
                    update(
                      (st) => {
                        st.uploads = st.uploads.filter((u) => u.id !== openSrc.id)
                        delete st.statuses[openSrc.id]
                      },
                      { kind: 'removed-source', detail: `Removed ${openSrc.title}` },
                    )
                    setOpen(null)
                    toast('Source removed')
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
            <SourceView source={openSrc} hidden={openSrc.mode === 'recognize'} />
          </div>
        )}
      </Panel>

      <AddSource open={adding} onClose={() => setAdding(false)} />

      <Dialog
        open={accept}
        onClose={() => setAccept(false)}
        title="Accept Lectern’s recommendations?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setAccept(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                update(
                  (st) => {
                    for (const x of recApprove) st.statuses[x.id] = 'approved'
                    for (const x of recExclude) st.statuses[x.id] = 'excluded'
                  },
                  { kind: 'approved', detail: `Accepted recommendations: approved ${recApprove.length}, left out ${recExclude.length}` },
                )
                setAccept(false)
                toast(`${recApprove.length} approved, ${recExclude.length} left out`)
              }}
            >
              Accept
            </Button>
          </>
        }
      >
        <p>
          This approves {recApprove.length} source{recApprove.length === 1 ? '' : 's'} and leaves out {recExclude.length}:
        </p>
        <ul class="dialog-list">
          {recExclude.map((x) => (
            <li key={x.id}>
              <strong>{x.title}</strong> stays out. {x.note}
            </li>
          ))}
        </ul>
        <p>You can change any decision later, and the tutor follows the change straight away.</p>
      </Dialog>
    </>
  )
}

function SourceRow({ src, status, uses, selected, onSelect, onOpen }: { src: Source; status: ReviewStatus; uses: number; selected: boolean; onSelect: () => void; onOpen: () => void }) {
  const Icon = kindIcon[src.kind] ?? kindIcon.upload
  return (
    <tr class={cx(selected && 'is-selected')}>
      <td class="col-check">
        <input type="checkbox" class="checkbox" checked={selected} onChange={onSelect} aria-label={`Select ${src.title}`} />
      </td>
      <td class="col-source">
        <button type="button" class="src-title" onClick={onOpen}>
          <Icon size={16} />
          <span>{src.title}</span>
        </button>
        <div class="src-sub">
          {src.date && <span>{fmtDate(src.date)}</span>}
          <span>{src.meta}</span>
          {src.mode === 'recognize' && <span class="badge">Recognize only</span>}
          {status === 'review' && src.proposed === 'excluded' && <span class="src-rec is-exclude">Recommended: leave out</span>}
        </div>
      </td>
      <td class="col-num tnum muted">{src.mode === 'recognize' ? '—' : uses ? `${uses} ${uses === 1 ? 'answer' : 'answers'}` : '—'}</td>
      <td class="col-status">
        <Status tone={STATUS_TONE[status]}>{STATUS_WORD[status]}</Status>
      </td>
      <td class="col-action">
        {status === 'review' ? (
          <div class="decide">
            <Button size="sm" variant="secondary" onClick={() => setStatus([src.id], 'approved')}>
              Approve
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setStatus([src.id], 'excluded')}>
              Leave out
            </Button>
          </div>
        ) : (
          <Switch
            id={`sw-${src.id}`}
            checked={status === 'approved'}
            label={`${src.title}: ${status === 'approved' ? 'approved, switch to leave out' : 'left out, switch to approve'}`}
            onChange={(v) => setStatus([src.id], v ? 'approved' : 'excluded')}
          />
        )}
      </td>
    </tr>
  )
}

function AddSource({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'file' | 'paste'>('file')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<SourceKind>('upload')
  const [kindTouched, setKindTouched] = useState(false)
  const [text, setText] = useState('')
  const [drag, setDrag] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  const save = (src: Source) => {
    update(
      (s) => {
        s.uploads = [...s.uploads, src]
        s.statuses[src.id] = 'approved'
      },
      { kind: 'added-source', detail: `Added ${src.title}` },
    )
    toast(`Added ${src.title} · ${src.passages.length} ${src.passages.length === 1 ? 'passage' : 'passages'}`)
    setTitle('')
    setText('')
    setKind('upload')
    setKindTouched(false)
    setErr('')
    onClose()
  }

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setBusy(true)
    setErr('')
    try {
      for (const f of Array.from(files)) save(await sourceFromFile(f))
    } catch (e) {
      setErr((e as Error).message || 'That file could not be read. Try a .vtt caption file, a PDF, or plain text.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel open={open} onClose={onClose} title="Add a source" sub="Anything you add is approved, because you added it. You can leave it out at any time." width={520}>
      <div class="tabs tabs-full" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'file'} class={cx('tab', tab === 'file' && 'is-active')} onClick={() => setTab('file')}>
          Upload a file
        </button>
        <button type="button" role="tab" aria-selected={tab === 'paste'} class={cx('tab', tab === 'paste' && 'is-active')} onClick={() => setTab('paste')}>
          Paste text
        </button>
      </div>
      {tab === 'file' ? (
        <div
          class={cx('dropzone', drag && 'is-drag')}
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDrag(false)
            onFiles(e.dataTransfer?.files ?? null)
          }}
        >
          <IconUpload size={22} />
          <p>
            <strong>Drop files here</strong> or{' '}
            <button type="button" class="link-btn" onClick={() => input.current?.click()}>
              choose them
            </button>
          </p>
          <p class="muted small">Caption files from Panopto or Zoom (.vtt, .srt) keep their timestamps. PDFs, Markdown and plain text work too.</p>
          <input ref={input} type="file" accept={ACCEPT} multiple hidden onChange={(e) => onFiles((e.target as HTMLInputElement).files)} />
          {busy && <p class="muted">Reading…</p>}
        </div>
      ) : (
        <form
          class="paste-form"
          onSubmit={(e) => {
            e.preventDefault()
            try {
              save(sourceFromPaste(title, text, kind))
            } catch (x) {
              setErr((x as Error).message)
            }
          }}
        >
          <div class="field">
            <label class="field-label" for="paste-title">
              Title
            </label>
            <input
              id="paste-title"
              class="input"
              value={title}
              placeholder="Lecture 14 · Buffers"
              onInput={(e) => {
                const v = (e.target as HTMLInputElement).value
                setTitle(v)
                // Until the type is chosen by hand, follow the title: "Syllabus" sets Syllabus, "Lecture 4" sets Lecture.
                if (!kindTouched) setKind(guessKind(v))
              }}
            />
          </div>
          <div class="field">
            <label class="field-label" for="paste-kind">
              Type
            </label>
            <select id="paste-kind" class="select" value={kind} onChange={(e) => {
                setKindTouched(true)
                setKind((e.target as HTMLSelectElement).value as SourceKind)
              }}
            >
              <option value="upload">Notes or handout</option>
              <option value="lecture">Lecture transcript</option>
              <option value="slides">Slides</option>
              <option value="syllabus">Syllabus</option>
              <option value="exam">Practice exam</option>
              <option value="pset">Open problem set (recognize only)</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label" for="paste-text">
              Text
            </label>
            <textarea id="paste-text" class="textarea" rows={10} value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} placeholder="Paste a transcript, notes, or a section of the syllabus." />
            <span class="field-help">Headings starting with # become sections the tutor can cite.</span>
          </div>
          <div>
            <Button type="submit" variant="primary" disabled={!text.trim()}>
              Add source
            </Button>
          </div>
        </form>
      )}
      {err && <p class="form-error">{err}</p>}
    </Panel>
  )
}
