import type { ComponentChildren } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { course, prof, reviewProgress } from '../app/context'
import { isLive, resetAll, update, useStore, type State } from '../state/store'
import { IconBook, IconChevron, IconArrowOut, IconMore, IconX } from '../ui/icons'
import { Button, Dialog, Status, Switch, cx, fmtTime, fmtDay, toast } from '../ui/kit'
import { STUDENT_URL } from '../app/config'
import { Overview } from './Overview'
import { Sources } from './Sources'
import { Rules } from './Rules'
import { Preview } from './Preview'
import { Questions } from './Questions'
import { GoLive } from './GoLive'

export type Page = 'overview' | 'sources' | 'rules' | 'preview' | 'questions' | 'golive'

export const go = (p: Page | 'student') => {
  location.hash = p
}

const PAGES: { id: Page; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'sources', label: 'Sources' },
  { id: 'rules', label: 'Rules' },
  { id: 'preview', label: 'Preview' },
  { id: 'questions', label: 'Questions' },
  { id: 'golive', label: 'Go live' },
]

export function setLive(on: boolean, s: State) {
  if (on) {
    update(
      (st) => {
        st.live = true
        st.liveSince = new Date().toISOString()
        st.pause = undefined
      },
      { kind: 'live-on', detail: `Turned the tutor on for ${course.enrolled} students` },
    )
    toast('Tutor is on for students')
  } else {
    update(
      (st) => {
        st.live = false
        st.pause = undefined
      },
      { kind: 'live-off', detail: 'Turned the tutor off' },
    )
    toast('Tutor is off. Students see a paused notice.')
  }
  void s
}

/** The one global control: words first, then the switch. Turning off is instant; turning on asks once. */
export function TutorSwitch({ compact }: { compact?: boolean }) {
  const s = useStore()
  const [confirm, setConfirm] = useState(false)
  const live = isLive(s)
  const p = reviewProgress(s)
  const paused = s.live && !live
  return (
    <div class={cx('tutor-switch', compact && 'is-compact', live && 'is-live')}>
      <div class="tutor-switch-text">
        <span class="tutor-switch-label">{live ? 'Tutor is on' : paused ? 'Tutor is paused' : 'Tutor is off'}</span>
        {!compact && (
          <span class="tutor-switch-sub">
            {live
              ? `Open to ${course.enrolled} students`
              : paused
                ? `Until ${fmtDay(s.pause!.to)}, ${fmtTime(s.pause!.to)}`
                : 'Students see a paused notice'}
          </span>
        )}
      </div>
      <Switch
        id={compact ? 'live-switch-top' : 'live-switch'}
        size="lg"
        checked={s.live}
        label={s.live ? 'Turn the tutor off' : 'Turn the tutor on'}
        onChange={(v) => (v ? setConfirm(true) : setLive(false, s))}
      />
      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title={`Turn on the tutor for ${course.enrolled} students?`}
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              Not yet
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setLive(true, s)
                setConfirm(false)
              }}
            >
              Turn on
            </Button>
          </>
        }
      >
        <p>
          Students with the link can ask questions right away. It will use the {p.approved} sources you approved
          {p.pending > 0 ? `; the ${p.pending} you haven’t reviewed stay out` : ''}.
        </p>
        <p>You can turn it off here at any moment, and it stops answering immediately.</p>
      </Dialog>
    </div>
  )
}

export function Console({ page }: { page: Page }) {
  const s = useStore()
  const [menu, setMenu] = useState(false)
  const [reset, setReset] = useState(false)
  const p = reviewProgress(s)
  const live = isLive(s)
  useEffect(() => setMenu(false), [page])
  useEffect(() => {
    document.querySelector('.console-main')?.scrollTo({ top: 0 })
  }, [page])

  const counts: Partial<Record<Page, ComponentChildren>> = {
    sources: p.pending > 0 ? <span class="nav-count" title="Waiting for your review">{p.pending}</span> : null,
    questions: s.log.length > 0 ? <span class="nav-count">{s.log.length}</span> : null,
  }

  const nav = (
    <nav class="sidebar" aria-label="Lectern">
      <div class="sidebar-course">
        <span class="course-mark" aria-hidden="true">
          <IconBook size={16} />
        </span>
        <div class="sidebar-course-text">
          <div class="sidebar-course-code">
            {course.code} <span class="muted">· {course.term}</span>
          </div>
          <div class="sidebar-course-title">{course.title}</div>
        </div>
        <button type="button" class="icon-btn sidebar-close" aria-label="Close menu" onClick={() => setMenu(false)}>
          <IconX size={16} />
        </button>
      </div>
      <ul class="nav-list">
        {PAGES.map((x) => (
          <li key={x.id}>
            <a href={`#${x.id}`} class={cx('nav-item', page === x.id && 'is-active')} aria-current={page === x.id ? 'page' : undefined}>
              <span>{x.label}</span>
              {counts[x.id]}
            </a>
          </li>
        ))}
      </ul>
      <div class="nav-group-label">What students see</div>
      <ul class="nav-list">
        <li>
          <a href="#student" class="nav-item">
            <span>Student view</span>
          </a>
        </li>
        <li>
          <a href={STUDENT_URL || '#student'} target="_blank" rel="noopener" class="nav-item">
            <span>Open in a new tab</span>
            <IconArrowOut size={15} />
          </a>
        </li>
      </ul>
      <div class="sidebar-foot">
        <TutorSwitch />
        <div class="sidebar-owner">
          <span>
            {prof.name} · <span class="muted">{prof.title}</span>
          </span>
          <button type="button" class="icon-btn" aria-label="Demo settings" title="Demo settings" onClick={() => setReset(true)}>
            <IconMore size={16} />
          </button>
        </div>
      </div>
    </nav>
  )

  return (
    <div class={cx('console', menu && 'menu-open')}>
      {nav}
      <div class="sidebar-scrim" onClick={() => setMenu(false)} />
      <div class="console-main">
        <header class="mobile-bar">
          <button type="button" class="mobile-menu" onClick={() => setMenu(true)} aria-label="Open menu">
            <span>{PAGES.find((x) => x.id === page)?.label}</span>
            <IconChevron size={14} />
          </button>
          <Status tone={live ? 'live' : 'muted'}>{live ? 'On' : 'Off'}</Status>
        </header>
        {!live && page !== 'golive' && (
          <div class="state-banner" role="status">
            <span>
              {s.live ? 'The tutor is paused.' : 'Your tutor is off.'} Students who open it see a notice that {prof.short} has paused it.
            </span>
            <a href="#golive" class="link-btn">
              {p.pending > 0 ? 'Review and go live' : 'Go live'}
            </a>
          </div>
        )}
        <main class="page">
          {page === 'overview' && <Overview />}
          {page === 'sources' && <Sources />}
          {page === 'rules' && <Rules />}
          {page === 'preview' && <Preview />}
          {page === 'questions' && <Questions />}
          {page === 'golive' && <GoLive />}
        </main>
      </div>
      <Dialog
        open={reset}
        onClose={() => setReset(false)}
        title="Reset this demo?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setReset(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                resetAll()
                setReset(false)
                go('overview')
                toast('Demo reset')
              }}
            >
              Reset everything
            </Button>
          </>
        }
      >
        <p>
          This clears your source decisions, rules, corrections, test questions and the question log in this browser, so the next professor starts fresh. Nothing
          is sent anywhere.
        </p>
      </Dialog>
    </div>
  )
}

export function PageHead({ title, sub, actions }: { title: string; sub?: ComponentChildren; actions?: ComponentChildren }) {
  return (
    <div class="page-head">
      <div class="page-head-text">
        <h1 class="page-title">{title}</h1>
        {sub && <p class="page-sub">{sub}</p>}
      </div>
      {actions && <div class="page-actions">{actions}</div>}
    </div>
  )
}
