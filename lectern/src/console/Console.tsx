import type { ComponentChildren } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { course, prof, reviewProgress, isDemo, workspace, setWorkspace } from '../app/context'
import { isLive, update, useStore, type State } from '../state/store'
import { IconLectern, IconChevron, IconArrowOut, IconMore, IconX, IconCheck, IconPlus } from '../ui/icons'
import { Button, Dialog, Popover, Status, Switch, cx, fmtTime, fmtDay, plural, toast } from '../ui/kit'
import { STUDENT_URL } from '../app/config'
import { Overview } from './Overview'
import { Sources } from './Sources'
import { Rules } from './Rules'
import { Preview } from './Preview'
import { Questions } from './Questions'
import { GoLive } from './GoLive'
import { Experiment } from './Experiment'
import { CourseForm, SettingsPanel } from './Settings'

export type Page = 'overview' | 'sources' | 'rules' | 'preview' | 'questions' | 'golive' | 'experiment'

const STRIP_KEY = 'lectern:strip-hidden'

const studentsPhrase = () => (course.enrolled ? plural(course.enrolled, 'student') : 'your students')
const stripHidden = () => {
  try {
    return localStorage.getItem(STRIP_KEY) === '1'
  } catch {
    return false
  }
}

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
      { kind: 'live-on', detail: `Turned the tutor on for ${studentsPhrase()}` },
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
export function TutorSwitch({ compact, id = 'live-switch' }: { compact?: boolean; id?: string }) {
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
              ? `Open to ${studentsPhrase()}`
              : paused
                ? `Until ${fmtDay(s.pause!.to)}, ${fmtTime(s.pause!.to)}`
                : 'Students see a paused notice'}
          </span>
        )}
      </div>
      <Switch
        id={id}
        size="lg"
        checked={s.live}
        label={s.live ? 'Turn the tutor off' : 'Turn the tutor on'}
        onChange={(v) => (v ? setConfirm(true) : setLive(false, s))}
      />
      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title={`Turn on the tutor for ${studentsPhrase()}?`}
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
          Students with the link can ask questions right away. It will use the {plural(p.approved, 'source')} you approved
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
  const [settings, setSettings] = useState(false)
  const [courseForm, setCourseForm] = useState<'create' | 'edit' | null>(null)
  const [switcher, setSwitcher] = useState(false)
  const [strip, setStrip] = useState(!stripHidden())
  const switchRef = useRef<HTMLButtonElement>(null)
  const p = reviewProgress(s)
  const live = isLive(s)
  useEffect(() => setMenu(false), [page])
  // On a phone the sidebar is a sheet: anything opened from it, or a course switch, closes it.
  useEffect(() => {
    if (settings || courseForm) setMenu(false)
  }, [settings, courseForm])
  useEffect(() => setMenu(false), [course])
  useEffect(() => {
    document.querySelector('.console-main')?.scrollTo({ top: 0 })
  }, [page])

  const counts: Partial<Record<Page, ComponentChildren>> = {
    sources: p.pending > 0 ? <span class="nav-count" title="Waiting for your review">{p.pending}</span> : null,
    questions: s.log.length > 0 ? <span class="nav-count">{s.log.length}</span> : null,
  }

  const nav = (
    <nav class="sidebar" aria-label="Lectern">
      <div class="sidebar-brand">
        <span class="brand-mark" aria-hidden="true">
          <IconLectern size={16} />
        </span>
        <span class="brand-name">Lectern</span>
        <button type="button" class="icon-btn sidebar-close" aria-label="Close menu" onClick={() => setMenu(false)}>
          <IconX size={16} />
        </button>
      </div>
      <button type="button" class="sidebar-course" ref={switchRef} onClick={() => setSwitcher((v) => !v)} aria-expanded={switcher} aria-haspopup="menu">
        <span class="sidebar-course-text">
          <span class="sidebar-course-code">
            {course.code} <span class="muted">· {isDemo() ? 'demo course' : course.term}</span>
          </span>
          <span class="sidebar-course-title">{course.title}</span>
        </span>
        <IconChevron size={14} />
      </button>
      <Popover anchor={switchRef.current} open={switcher} onClose={() => setSwitcher(false)} class="menu">
        <div role="menu" aria-label="Courses">
          <button
            type="button"
            role="menuitem"
            class="menu-item"
            onClick={() => {
              setSwitcher(false)
              setWorkspace({ active: 'demo', mine: workspace.mine })
            }}
          >
            <span class="menu-check">{isDemo() ? <IconCheck size={14} /> : null}</span>
            <span>
              CHEM 11 <span class="muted">· demo course</span>
            </span>
          </button>
          {workspace.mine ? (
            <button
              type="button"
              role="menuitem"
              class="menu-item"
              onClick={() => {
                setSwitcher(false)
                setWorkspace({ active: 'mine', mine: workspace.mine })
              }}
            >
              <span class="menu-check">{!isDemo() ? <IconCheck size={14} /> : null}</span>
              <span>
                {workspace.mine.code} <span class="muted">· your course</span>
              </span>
            </button>
          ) : null}
          <div class="menu-sep" />
          <button
            type="button"
            role="menuitem"
            class="menu-item"
            onClick={() => {
              setSwitcher(false)
              setCourseForm(workspace.mine ? 'edit' : 'create')
            }}
          >
            <span class="menu-check">
              <IconPlus size={14} />
            </span>
            <span>{workspace.mine ? `Edit ${workspace.mine.code} details` : 'Set up your own course'}</span>
          </button>
        </div>
      </Popover>
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
      <div class="nav-group-label">For the founder</div>
      <ul class="nav-list">
        <li>
          <a href="#experiment" class={cx('nav-item', page === 'experiment' && 'is-active')} aria-current={page === 'experiment' ? 'page' : undefined}>
            <span>The experiment</span>
          </a>
        </li>
      </ul>
      <div class="sidebar-foot">
        <TutorSwitch />
        <div class="sidebar-owner">
          <span>
            {prof.name}
            {prof.title && <span class="muted"> · {prof.title}</span>}
          </span>
          <button type="button" class="icon-btn" aria-label="Settings" title="Settings" onClick={() => setSettings(true)}>
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
            <span>{page === 'experiment' ? 'The experiment' : PAGES.find((x) => x.id === page)?.label}</span>
            <IconChevron size={14} />
          </button>
          <Status tone={live ? 'live' : 'muted'}>{live ? 'On' : 'Off'}</Status>
        </header>
        {strip && page !== 'experiment' && (
          <div class="mvp-strip" role="note">
            <span>
              <strong>ES 30 MVP.</strong> Testing one assumption: will professors hand over their materials and announce a course tutor to their class?
            </span>
            <a href="#experiment" class="link-btn">
              See the experiment
            </a>
            <button
              type="button"
              class="icon-btn"
              aria-label="Hide this note"
              onClick={() => {
                setStrip(false)
                try {
                  localStorage.setItem(STRIP_KEY, '1')
                } catch {
                  /* storage blocked */
                }
              }}
            >
              <IconX size={14} />
            </button>
          </div>
        )}
        {!live && page !== 'golive' && page !== 'experiment' && (
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
          {page === 'experiment' && <Experiment />}
        </main>
      </div>
      <SettingsPanel
        open={settings}
        onClose={() => setSettings(false)}
        onEditCourse={() => {
          setSettings(false)
          setCourseForm('edit')
        }}
        onCreateCourse={() => {
          setSettings(false)
          if (workspace.mine) setWorkspace({ active: 'mine', mine: workspace.mine })
          else setCourseForm('create')
        }}
      />
      <CourseForm open={!!courseForm} mode={courseForm ?? 'create'} onClose={() => setCourseForm(null)} />
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
