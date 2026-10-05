import { useEffect, useRef, useState } from 'preact/hooks'
import { course, prof, reviewProgress, isDemo, allSources, statusOf, workspace } from '../app/context'
import { getState } from '../state/store'
import { inPause, isLive, update, useStore } from '../state/store'
import { parse, type Inline } from '../lib/md'
import { IconCopy, IconMegaphone, IconCheck, IconClock, IconDownload } from '../ui/icons'
import { Button, Status, copyText, fmtDay, fmtTime, toast, cx, plural } from '../ui/kit'
import { PageHead, TutorSwitch } from './Console'
import { STUDENT_URL, inArtifact } from '../app/config'
import { canPublish, fileBase, saveFile, studentPage, zipOne } from '../state/publish'

const MIDTERM = { label: 'during Midterm 1', from: '2026-10-14T19:00:00-04:00', to: '2026-10-14T22:00:00-04:00' }

/** What the tutor was built from, in the professor's words, from the sources she approved. */
function materialsPhrase() {
  const s = getState()
  const kinds = new Set(allSources(s).filter((x) => statusOf(s, x) === 'approved' && x.mode === 'answer').map((x) => x.kind))
  const parts: string[] = []
  if (kinds.has('lecture')) parts.push('the lecture recordings')
  if (kinds.has('slides')) parts.push('slides')
  if (kinds.has('syllabus')) parts.push('the syllabus')
  if (kinds.has('exam')) parts.push(isDemo() ? 'the practice midterm' : 'the practice exams')
  if (kinds.has('ed')) parts.push('my answers here on Ed')
  if (kinds.has('upload') || kinds.has('pset')) parts.push('notes I added')
  if (!parts.length) return 'the materials I approved'
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0]
}

export function defaultAnnouncement() {
  const demo = isDemo()
  const s = getState()
  const approved = allSources(s).filter((x) => statusOf(s, x) === 'approved')
  // The demo is hosted at this link; an own course reaches students through the downloaded page, wherever it's put.
  const link = (demo && STUDENT_URL) || '[link to the tutor]'
  const lectures = approved.filter((x) => x.kind === 'lecture').length
  const hasExam = approved.some((x) => x.kind === 'exam')
  const closing = demo
    ? `Midterm 1 is Wednesday, October 14. The tutor has Lectures 1–13 and the practice exam.`
    : lectures
      ? `The tutor has the ${lectures} lecture${lectures === 1 ? '' : 's'} we’ve covered so far, and I’ll add new ones as we go.`
      : `I’ll add new lectures as we go.`
  const good = [
    'Re-explaining something from lecture in a different way',
    lectures || demo ? 'Finding where we covered a topic (it links to the lecture and the timestamp)' : 'Finding where we covered a topic (it links to the source)',
    hasExam && (demo ? 'Working through the practice midterm' : 'Working through the practice exams'),
  ].filter(Boolean)
  const privacy = demo
    ? `**Privacy:** The TFs and I can read the questions asked in the tutor, without your names. We'll use them to see where the class is stuck and to plan section and lecture.`
    : `**Privacy:** The questions you ask stay on your own device. The TFs and I can't see them.`
  return {
    title: demo ? `New: a ${course.code} tutor built from our lectures` : `New: a study tutor for ${course.code}, built from our ${lectures ? 'lectures' : 'course materials'}`,
    body: `Hi everyone,

Starting today you can use a study tutor built only from our course materials: ${materialsPhrase()}. I chose and approved every source it uses.

**Where to find it:** ${link}

**What it's good for:**
${good.map((g) => `- ${g}`).join('\n')}

**What it won't do:** It won't solve or check problem set questions. If you ask, it will say so and help with the idea behind the problem instead. Problem sets are still yours to work through under the collaboration policy in the syllabus.

${privacy}

Ed, section and office hours aren't going anywhere. If the tutor's answer doesn't match what you heard in lecture, trust lecture and post here.

${closing}

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
  if (p.pending > 0) warnings.push({ text: `${plural(p.pending, 'source')} still ${p.pending === 1 ? 'needs' : 'need'} review. ${p.pending === 1 ? 'It stays' : 'They stay'} out until you approve ${p.pending === 1 ? 'it' : 'them'}.`, href: '#sources', cta: 'Review' })
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
            {isDemo() ? (
              <Button variant="secondary" onClick={() => setPause(new Date(MIDTERM.from), new Date(MIDTERM.to), MIDTERM.label)}>
                Pause during Midterm 1 · Wed Oct 14, 7–10 pm
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setPause(new Date(), new Date(Date.now() + 24 * 3600_000), 'for 24 hours')}>
                Pause for 24 hours
              </Button>
            )}
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
        {isDemo() ? (
          STUDENT_URL ? (
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
          )
        ) : (
          <PublishBox />
        )}
        <p class="muted small">
          Students see the tutor only. They can’t see this console, your sources list or other students’ questions. <a href="#student">See what they see.</a>
        </p>
      </section>
    </>
  )
}

/** An own course has no server behind it yet, so students get a downloaded copy of the tutor. */
function PublishBox() {
  const s = useStore()
  const meta = workspace.mine
  const approved = allSources(s).filter((x) => statusOf(s, x) === 'approved').length
  if (!meta) return null
  const download = (as: 'zip' | 'html') => {
    try {
      const html = studentPage(meta, s)
      const base = fileBase(meta)
      if (as === 'zip') saveFile(`${base}.zip`, zipOne('index.html', html))
      else saveFile(`${base}.html`, new Blob([html], { type: 'text/html' }))
      update(() => {}, { kind: 'published-page', detail: `Downloaded the student page with ${approved} source${approved === 1 ? '' : 's'}` })
      toast(as === 'zip' ? 'Downloaded. Drag the .zip onto Netlify Drop for a link.' : 'Downloaded. Upload the file where students can open it.')
    } catch (e) {
      toast((e as Error).message)
    }
  }
  if (inArtifact)
    return (
      <p class="muted">
        Your course is saved in this browser. To give students their own copy, open Lectern from its Netlify link and download the student page from this section.
      </p>
    )
  return (
    <div class="publish">
      <p>
        Your course is saved in this browser only, so a link to this page won’t show students your materials. Download the student page instead and put it
        online. It carries the {approved} source{approved === 1 ? '' : 's'} you approved and your rules, and nothing you left out.
      </p>
      <div class="publish-actions">
        <Button variant="primary" icon={<IconDownload size={16} />} disabled={!approved || !canPublish()} onClick={() => download('zip')}>
          Download for Netlify
        </Button>
        <Button variant="secondary" disabled={!approved || !canPublish()} onClick={() => download('html')}>
          Download as one .html file
        </Button>
      </div>
      <ol class="publish-steps">
        <li>
          Drag the .zip onto{' '}
          <a href="https://app.netlify.com/drop" target="_blank" rel="noopener">
            app.netlify.com/drop
          </a>
          . Netlify gives you a public link in about a minute. Paste it into the announcement above.
        </li>
        <li>Or upload the .html file to Canvas Files and link to it from your course page.</li>
      </ol>
      <p class="muted small">
        {!approved
          ? 'Add and approve at least one source first. '
          : !canPublish()
            ? 'Downloading needs the built app (npm run build), not the dev server. '
            : ''}
        In this version the downloaded page runs on its own: questions asked there stay on each student’s device and don’t reach your Questions page, and the switch
        here doesn’t reach it. To take it down, delete the Netlify site or the file. Download again after you change sources or rules.
      </p>
    </div>
  )
}
