import { useEffect, useRef, useState } from 'preact/hooks'
import { course, prof, reviewProgress } from '../app/context'
import { inPause, isLive, update, useStore } from '../state/store'
import { parse, type Inline } from '../lib/md'
import { IconCopy, IconMegaphone, IconCheck, IconClock } from '../ui/icons'
import { Button, Status, copyText, fmtDay, fmtTime, toast, cx } from '../ui/kit'
import { PageHead, TutorSwitch } from './Console'
import { STUDENT_URL } from '../app/config'

const MIDTERM = { label: 'during Midterm 1', from: '2026-10-14T19:00:00-04:00', to: '2026-10-14T22:00:00-04:00' }

export function defaultAnnouncement() {
  const link = STUDENT_URL || '[link to the tutor]'
  return {
    title: `New: a ${course.code} tutor built from our lectures`,
    body: `Hi everyone,

Starting today you can use a study tutor built only from our course materials: the lecture recordings, slides, syllabus, the practice midterm and my answers here on Ed. I chose and approved every source it uses.

**Where to find it:** ${link}

**What it's good for:**
- Re-explaining something from lecture in a different way
- Finding where we covered a topic (it links to the lecture and the timestamp)
- Working through the practice midterm

**What it won't do:** It won't solve or check problem set questions. If you ask, it will say so and help with the idea behind the problem instead. Problem sets are still yours to work through under the collaboration policy in the syllabus.

**Privacy:** The TFs and I can read the questions asked in the tutor, without your names. We'll use them to see where the class is stuck and to plan section and lecture.

Ed, section and office hours aren't going anywhere. If the tutor's answer doesn't match what you heard in lecture, trust lecture and post here.

Midterm 1 is Wednesday, October 14. The tutor has Lectures 1–13 and the practice exam.

Best,
${prof.short}`,
  }
}

function EdInline({ c }: { c: Inline[] }) {
  return <>{c.map((x, i) => (x.t === 'b' ? <strong key={i}>{x.v}</strong> : x.t === 'text' ? x.v : null))}</>
}

/** A faithful preview of how the post reads on Ed: post layout and badges, without Ed's own branding. */
function EdPreview({ title, body }: { title: string; body: string }) {
  return (
    <figure class="edcard" aria-label="Preview of the Ed announcement">
      <div class="edcard-title">
        <IconMegaphone size={22} />
        <span>{title || 'Untitled'}</span>
      </div>
      <div class="edcard-meta">
        <span class="edcard-avatar" aria-hidden="true">
          {prof.name[0]}
        </span>
        <div>
          <div>
            <span class="edcard-name">{prof.name}</span> <span class="edcard-badge">Instructor</span>
          </div>
          <div class="edcard-when">
            just now in <span class="edcard-cat">{course.edCategoryForAnnouncement}</span>
          </div>
        </div>
        <div class="edcard-stats" aria-hidden="true">
          <span>Pinned</span>
          <span>0 views</span>
        </div>
      </div>
      <div class="edcard-body">
        {parse(body).map((b, i) =>
          b.t === 'ul' || b.t === 'ol' ? (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>
                  <EdInline c={it} />
                </li>
              ))}
            </ul>
          ) : (
            <p key={i}>
              <EdInline c={b.c} />
            </p>
          ),
        )}
      </div>
      <div class="edcard-actions" aria-hidden="true">
        Comment Edit Delete
      </div>
    </figure>
  )
}

export function GoLive() {
  const s = useStore()
  const p = reviewProgress(s)
  const live = isLive(s)
  const ann = s.announcement ?? defaultAnnouncement()
  const [title, setTitle] = useState(ann.title)
  const [body, setBody] = useState(ann.body)
  const saveTimer = useRef<number | undefined>(undefined)
  const pre = useRef<HTMLDivElement>(null)

  // Save edits after a pause in typing.
  useEffect(() => {
    clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      const cur = s.announcement
      if (cur?.title === title && cur?.body === body) return
      if (!cur && title === ann.title && body === ann.body) return
      update((st) => {
        st.announcement = { ...(st.announcement ?? {}), title, body }
      })
    }, 600)
    return () => clearTimeout(saveTimer.current)
  }, [title, body])

  const warnings: { text: string; href: string; cta: string }[] = []
  if (p.pending > 0) warnings.push({ text: `${p.pending} sources still need review. They stay out until you approve them.`, href: '#sources', cta: 'Review' })
  if (!s.rulesConfirmedAt) warnings.push({ text: 'You haven’t confirmed the rules yet.', href: '#rules', cta: 'Check rules' })
  if (s.previewCount < 3) warnings.push({ text: 'Try a few questions first, so nothing it says surprises you.', href: '#preview', cta: 'Preview' })

  const setPause = (from: Date, to: Date, label: string) =>
    update(
      (st) => {
        st.pause = { from: from.toISOString(), to: to.toISOString(), label }
      },
      { kind: 'paused', detail: `Scheduled a pause ${label}` },
    )

  const plainPost = `${title}\n\n${body.replace(/\*\*/g, '')}`

  return (
    <>
      <PageHead title="Go live" sub="One switch for students, and one post to tell them about it. You can turn it off at any moment." />

      <section class="golive-switch" aria-label="Tutor status">
        <TutorSwitch id="live-switch-page" />
        <div class="golive-explain">
          {live ? (
            <p>
              Students with the link can ask questions now. Every question appears under <a href="#questions">Questions</a>. Turning it off stops answers immediately; students
              then see a notice pointing them to Ed and office hours.
            </p>
          ) : (
            <p>
              While it’s off, students who open the link see a notice that you’ve paused it, with your office hours. Turning it on asks you to confirm once.
            </p>
          )}
        </div>
      </section>

      {warnings.length > 0 && (
        <ul class="readiness" aria-label="Before you go live">
          {warnings.map((w) => (
            <li key={w.text}>
              <span>{w.text}</span>
              <a href={w.href} class="link-btn">
                {w.cta}
              </a>
            </li>
          ))}
        </ul>
      )}

      <section class="golive-section" aria-labelledby="pause-title">
        <h2 id="pause-title" class="section-title">
          Pause for a set time
        </h2>
        <p class="muted">The tutor stays on, but stops answering for the window you choose and comes back on its own.</p>
        {s.pause && new Date(s.pause.to).getTime() > Date.now() ? (
          <div class="pause-set">
            <IconClock size={16} />
            <span>
              {inPause(s) ? 'Paused now' : 'Pause scheduled'} {s.pause.label}: {fmtDay(s.pause.from)}, {fmtTime(s.pause.from)} to {fmtTime(s.pause.to)}
            </span>
            <Button size="sm" variant="ghost" onClick={() => update((st) => void (st.pause = undefined), { kind: 'paused', detail: 'Cancelled the scheduled pause' })}>
              Cancel pause
            </Button>
          </div>
        ) : (
          <div class="pause-options">
            <Button variant="secondary" onClick={() => setPause(new Date(), new Date(Date.now() + 3600_000), 'for an hour')}>
              Pause for an hour
            </Button>
            <Button variant="secondary" onClick={() => setPause(new Date(MIDTERM.from), new Date(MIDTERM.to), MIDTERM.label)}>
              Pause during Midterm 1 · Wed Oct 14, 7–10 pm
            </Button>
          </div>
        )}
      </section>

      <section class="golive-section" aria-labelledby="ann-title">
        <div class="section-head">
          <h2 id="ann-title" class="section-title">
            Tell your class
          </h2>
          {s.announcement?.postedAt ? (
            <Status tone="good">Posted {fmtDay(s.announcement.postedAt)}</Status>
          ) : s.announcement?.copiedAt ? (
            <Status tone="muted">Copied, not marked as posted</Status>
          ) : null}
        </div>
        <p class="muted">A ready-to-post Ed announcement in your voice. Edit anything, copy it, and post it as an Announcement in {course.edCategoryForAnnouncement}.</p>
        <div class="ann-grid">
          <div class="ann-edit">
            <div class="field">
              <label class="field-label" for="ann-title-input">
                Title
              </label>
              <input id="ann-title-input" class="input" value={title} onInput={(e) => setTitle((e.target as HTMLInputElement).value)} />
            </div>
            <div class="field">
              <label class="field-label" for="ann-body-input">
                Post
              </label>
              <textarea id="ann-body-input" class="textarea ann-body" rows={18} value={body} onInput={(e) => setBody((e.target as HTMLTextAreaElement).value)} />
              <span class="field-help">Words between ** and ** appear in bold. Lines starting with “- ” become a list.</span>
            </div>
            <div class="form-actions">
              <Button
                variant="primary"
                icon={<IconCopy size={16} />}
                onClick={async () => {
                  const ok = await copyText(plainPost, pre.current)
                  update(
                    (st) => {
                      st.announcement = { ...(st.announcement ?? { title, body }), title, body, copiedAt: new Date().toISOString() }
                    },
                    { kind: 'copied-announcement', detail: 'Copied the Ed announcement' },
                  )
                  toast(ok ? 'Copied. Paste it into a new Ed announcement.' : 'Selected below. Copy it with your keyboard.')
                }}
              >
                Copy post
              </Button>
              <Button
                variant={s.announcement?.postedAt ? 'quiet' : 'secondary'}
                icon={<IconCheck size={16} />}
                disabled={!!s.announcement?.postedAt}
                onClick={() =>
                  update(
                    (st) => {
                      st.announcement = { ...(st.announcement ?? { title, body }), title, body, postedAt: new Date().toISOString() }
                    },
                    { kind: 'posted-announcement', detail: 'Marked the Ed announcement as posted' },
                  )
                }
              >
                {s.announcement?.postedAt ? 'Marked as posted' : 'I posted it on Ed'}
              </Button>
              {(title !== defaultAnnouncement().title || body !== defaultAnnouncement().body) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    const d = defaultAnnouncement()
                    setTitle(d.title)
                    setBody(d.body)
                  }}
                >
                  Restore the draft
                </Button>
              )}
            </div>
            <div ref={pre} class="sr-only">
              {plainPost}
            </div>
          </div>
          <div class="ann-preview">
            <div class="ann-preview-label muted small">How it will read on Ed</div>
            <EdPreview title={title} body={body} />
          </div>
        </div>
      </section>

      <section class={cx('golive-section', 'student-link')} aria-labelledby="link-title">
        <h2 id="link-title" class="section-title">
          Link for students
        </h2>
        {STUDENT_URL ? (
          <div class="link-row">
            <code class="link-code">{STUDENT_URL}</code>
            <Button
              size="sm"
              variant="secondary"
              icon={<IconCopy size={15} />}
              onClick={async () => toast((await copyText(STUDENT_URL)) ? 'Link copied' : 'Select the link and copy it')}
            >
              Copy link
            </Button>
          </div>
        ) : (
          <p class="muted">The student link appears here once the tutor is published.</p>
        )}
        <p class="muted small">
          Students see the tutor only. They can’t see this console, your sources list or other students’ questions. <a href="#student">See what they see.</a>
        </p>
      </section>
    </>
  )
}
