import { useEffect, useState } from 'preact/hooks'
import { course, isDemo, setOwnCourse, setWorkspace, workspace } from '../app/context'
import { getApiKey, setApiKey, testKey, MODEL } from '../engine/anthropic'
import { lastApiError } from '../engine/tutor'
import { getSample } from '../engine/claude'
import { resetAll } from '../state/store'
import { blankMeta, type CourseMeta } from '../state/workspace'
import { Button, Dialog, Panel, Status, toast } from '../ui/kit'
import { go } from './Console'

/** The professor's own course: create it, or edit its details. */
export function CourseForm({ open, onClose, mode }: { open: boolean; onClose: () => void; mode: 'create' | 'edit' }) {
  const [m, setM] = useState<CourseMeta>(blankMeta())
  useEffect(() => {
    if (open) setM(mode === 'edit' && workspace.mine ? { ...workspace.mine } : { ...blankMeta(), ...(workspace.mine ?? {}) })
  }, [open])
  const set = (k: keyof CourseMeta) => (e: Event) => setM({ ...m, [k]: (e.target as HTMLInputElement).value })
  const valid = m.code.trim() && m.title.trim() && m.profName.trim()
  return (
    <Panel
      open={open}
      onClose={onClose}
      width={520}
      title={mode === 'create' ? 'Set up your own course' : 'Course details'}
      sub={mode === 'create' ? 'A blank tutor for your course. You add the materials; the CHEM 11 demo stays as it is.' : 'Students see these in the tutor and the Ed announcement.'}
    >
      <form
        class="course-form"
        onSubmit={(e) => {
          e.preventDefault()
          if (!valid) return
          setOwnCourse({ ...m, profShort: m.profShort.trim() || m.profName.trim(), enrolled: Number(m.enrolled) || 0 })
          onClose()
          if (mode === 'create') {
            go('sources')
            toast(`${m.code} is ready. Add your syllabus and a few lectures.`)
          } else toast('Saved')
        }}
      >
        <div class="form-row">
          <div class="field">
            <label class="field-label" for="cf-code">
              Course code
            </label>
            <input id="cf-code" class="input" value={m.code} onInput={set('code')} placeholder="ECON 10a" required />
          </div>
          <div class="field">
            <label class="field-label" for="cf-term">
              Term
            </label>
            <input id="cf-term" class="input" value={m.term} onInput={set('term')} placeholder="Fall 2026" />
          </div>
        </div>
        <div class="field">
          <label class="field-label" for="cf-title">
            Course title
          </label>
          <input id="cf-title" class="input" value={m.title} onInput={set('title')} placeholder="Principles of Economics" required />
        </div>
        <div class="form-row">
          <div class="field">
            <label class="field-label" for="cf-name">
              Your name
            </label>
            <input id="cf-name" class="input" value={m.profName} onInput={set('profName')} placeholder="Jordan Lee" required />
          </div>
          <div class="field">
            <label class="field-label" for="cf-short">
              What students call you
            </label>
            <input id="cf-short" class="input" value={m.profShort} onInput={set('profShort')} placeholder="Prof. Lee" />
          </div>
        </div>
        <div class="field">
          <label class="field-label" for="cf-title2">
            Your title
          </label>
          <input id="cf-title2" class="input" value={m.profTitle} onInput={set('profTitle')} placeholder="Senior Lecturer in Economics" />
        </div>
        <div class="field">
          <label class="field-label" for="cf-oh">
            Office hours
          </label>
          <input id="cf-oh" class="input" value={m.officeHours} onInput={set('officeHours')} placeholder="Tue 2–3:30 pm · TF hours Sun–Thu evenings" />
          <span class="field-help">The tutor sends students here when your materials don’t cover a question.</span>
        </div>
        <div class="form-row">
          <div class="field">
            <label class="field-label" for="cf-enrolled">
              Students enrolled
            </label>
            <input id="cf-enrolled" class="input" type="number" min={0} value={m.enrolled || ''} onInput={set('enrolled')} placeholder="230" />
          </div>
          <div class="field">
            <label class="field-label" for="cf-ed">
              Ed category for announcements
            </label>
            <input id="cf-ed" class="input" value={m.edCategory} onInput={set('edCategory')} placeholder="General" />
          </div>
        </div>
        <div class="form-actions">
          <Button type="submit" variant="primary" disabled={!valid}>
            {mode === 'create' ? 'Create course' : 'Save'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Panel>
  )
}

export function SettingsPanel({ open, onClose, onEditCourse, onCreateCourse }: { open: boolean; onClose: () => void; onEditCourse: () => void; onCreateCourse: () => void }) {
  const [key, setKey] = useState('')
  const [saved, setSaved] = useState(getApiKey())
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [viewer, setViewer] = useState<boolean | null>(null)
  const [reset, setReset] = useState(false)
  useEffect(() => {
    if (!open) return
    setSaved(getApiKey())
    setKey('')
    setResult(lastApiError || null)
    getSample().then((s) => setViewer(!!s))
  }, [open])

  const engine = viewer ? 'viewer' : saved ? 'key' : 'quotes'
  return (
    <>
      <Panel open={open} onClose={onClose} width={520} title="Settings" sub="These settings live in this browser only.">
        <div class="settings">
          <section class="settings-section" aria-labelledby="set-answers">
            <h3 id="set-answers" class="settings-title">
              Answers to new questions
            </h3>
            <p class="muted">
              Prepared answers, problem-set declines and staff routing never need a model. For a question nobody has asked before, the tutor either writes an answer with
              Claude from the matching passages, or quotes the passages directly.
            </p>
            <div class="settings-status">
              {engine === 'viewer' && <Status tone="good">Claude, through the Claude viewer you’re signed in to</Status>}
              {engine === 'key' && <Status tone="good">Claude ({MODEL}), with the API key saved below</Status>}
              {engine === 'quotes' && <Status tone="muted">Quoting passages. Add an API key for written answers.</Status>}
            </div>
            {viewer === false && (
              <form
                class="key-form"
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!key.trim()) return
                  setChecking(true)
                  setResult(null)
                  const r = await testKey(key)
                  setChecking(false)
                  if (r.ok) {
                    setApiKey(key)
                    setSaved(key.trim())
                    setKey('')
                    toast('Key saved. New questions get written answers.')
                  } else setResult(r.message)
                }}
              >
                <label class="field-label" for="api-key">
                  Anthropic API key
                </label>
                <div class="key-row">
                  <input
                    id="api-key"
                    class="input"
                    type="password"
                    autoComplete="off"
                    spellcheck={false}
                    value={key}
                    placeholder={saved ? `Saved: ${saved.slice(0, 10)}…${saved.slice(-4)}` : 'sk-ant-…'}
                    onInput={(e) => setKey((e.target as HTMLInputElement).value)}
                  />
                  <Button type="submit" variant="primary" disabled={!key.trim() || checking}>
                    {checking ? 'Checking…' : 'Save'}
                  </Button>
                </div>
                <span class="field-help">
                  Stored in this browser and sent only to Anthropic. Use it on your own computer, not a shared one. Each answer costs a fraction of a cent.
                </span>
                {result && <p class="form-error">{result}</p>}
                {saved && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setApiKey('')
                      setSaved('')
                      toast('Key removed. New questions get quoted passages.')
                    }}
                  >
                    Remove saved key
                  </Button>
                )}
              </form>
            )}
          </section>

          <section class="settings-section" aria-labelledby="set-course">
            <h3 id="set-course" class="settings-title">
              This course
            </h3>
            {isDemo() ? (
              <>
                <p class="muted">
                  {course.code} is the demo course, built from fictional materials in Prof. Marsh’s voice. To try Lectern with your own syllabus and lectures, set up your own course.
                </p>
                <div>
                  <Button variant="secondary" onClick={onCreateCourse}>
                    {workspace.mine ? `Switch to ${workspace.mine.code}` : 'Set up your own course'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p class="muted">
                  {course.code} · {course.title} · {course.professor.short}
                </p>
                <div class="settings-actions">
                  <Button variant="secondary" onClick={onEditCourse}>
                    Edit course details
                  </Button>
                  <Button variant="ghost" onClick={() => setWorkspace({ active: 'demo', mine: workspace.mine })}>
                    Back to the demo
                  </Button>
                </div>
              </>
            )}
          </section>

          <section class="settings-section" aria-labelledby="set-reset">
            <h3 id="set-reset" class="settings-title">
              Start over
            </h3>
            <p class="muted">Clears this course’s decisions, rules, corrections, uploads and question log in this browser, so the next professor starts fresh.</p>
            <div>
              <Button variant="danger" onClick={() => setReset(true)}>
                Reset {course.code}
              </Button>
            </div>
          </section>
        </div>
      </Panel>
      <Dialog
        open={reset}
        onClose={() => setReset(false)}
        title={`Reset ${course.code}?`}
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
                onClose()
                go('overview')
                toast(`${course.code} reset`)
              }}
            >
              Reset everything
            </Button>
          </>
        }
      >
        <p>This can’t be undone. Nothing is sent anywhere; it only clears what this browser saved.</p>
      </Dialog>
    </>
  )
}
