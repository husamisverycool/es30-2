import { course, prof, reviewProgress, allSources } from '../app/context'
import { isLive, useStore } from '../state/store'
import { RULES } from '../engine/rules'
import { IconCheck } from '../ui/icons'
import { cx, fmtDate, relTime } from '../ui/kit'
import { PageHead } from './Console'

export function Overview() {
  const s = useStore()
  const p = reviewProgress(s)
  const live = isLive(s)
  const src = allSources(s)
  const lectures = course.sources.filter((x) => x.kind === 'lecture')
  const slides = course.sources.filter((x) => x.kind === 'slides')
  const open = course.sources.filter((x) => x.mode === 'recognize')
  const ed = course.sources.filter((x) => x.kind === 'ed')
  const edMine = ed.find((x) => x.proposed === 'approved')
  const edTf = ed.find((x) => x.proposed === 'excluded')
  const exams = course.sources.filter((x) => x.kind === 'exam')
  const first = lectures[0]?.date
  const last = lectures[lectures.length - 1]?.date

  const steps = [
    {
      title: 'Review the sources',
      detail: p.pending === 0 ? `${p.approved} approved, ${p.total - p.approved} left out` : `${p.decided} of ${p.total} reviewed`,
      time: 'About 6 minutes',
      done: p.pending === 0,
      href: '#sources',
      cta: p.decided ? 'Continue' : 'Start',
    },
    {
      title: 'Check the rules',
      detail: `${RULES.length} rules, ${RULES.filter((r) => r.locked).length} of them always on`,
      time: 'About 2 minutes',
      done: !!s.rulesConfirmedAt,
      href: '#rules',
      cta: 'Check',
    },
    {
      title: 'Ask it a few questions',
      detail: s.previewCount ? `${s.previewCount} asked so far` : `${course.testQuestions.length} questions from your Ed history are ready to try`,
      time: 'About 5 minutes',
      done: s.previewCount >= 3,
      href: '#preview',
      cta: 'Try it',
    },
    {
      title: 'Turn it on and tell your class',
      detail: live ? (s.announcement?.postedAt ? 'On, and announced on Ed' : 'On. The Ed announcement is ready to copy.') : 'One switch and one Ed post',
      time: 'About 2 minutes',
      done: live && !!s.announcement?.postedAt,
      href: '#golive',
      cta: 'Go live',
    },
  ]
  const done = steps.filter((x) => x.done).length

  return (
    <>
      <PageHead
        title={done === 4 ? 'Your tutor is live' : 'Your tutor is ready for review'}
        sub={
          done === 4
            ? `Students are using it. Their questions appear under Questions as they ask them.`
            : `Lectern built it from what you already post on Canvas and Ed. Reviewing it takes about 15 minutes, and nothing reaches students until you turn it on.`
        }
      />
      <div class="overview-grid">
        <section class="ov-main" aria-labelledby="ov-steps">
          <div class="section-head">
            <h2 id="ov-steps" class="section-title">
              Setup
            </h2>
            <span class="muted tnum">
              {done} of 4 done
            </span>
          </div>
          <div class="steps-progress" role="progressbar" aria-valuemin={0} aria-valuemax={4} aria-valuenow={done} aria-label="Setup progress">
            <span style={{ width: `${(done / 4) * 100}%` }} />
          </div>
          <ol class="steps">
            {steps.map((st, i) => (
              <li key={st.title} class={cx('step', st.done && 'is-done')}>
                <span class="step-n" aria-hidden="true">
                  {st.done ? <IconCheck size={14} /> : i + 1}
                </span>
                <div class="step-text">
                  <div class="step-title">{st.title}</div>
                  <div class="step-detail">
                    {st.detail}
                    {!st.done && <span class="muted"> · {st.time}</span>}
                  </div>
                </div>
                <a href={st.href} class={cx('btn btn-sm', st.done ? 'btn-ghost' : i === steps.findIndex((x) => !x.done) ? 'btn-primary' : 'btn-secondary')}>
                  {st.done ? 'Open' : st.cta}
                </a>
              </li>
            ))}
          </ol>

          <h2 class="section-title ov-sub">Already done for you</h2>
          <ul class="done-list">
            <li>
              Transcribed {lectures.length} lecture recordings from Canvas
              {first && last ? `, ${fmtDate(first)} to ${fmtDate(last)}` : ''}.
            </li>
            <li>Pulled {slides.length} slide decks and the syllabus.</li>
            {open.map((o) => (
              <li key={o.id}>Added {o.title.split('·')[0].trim()} so the tutor can recognize its questions and decline them. Students never see its text.</li>
            ))}
            {exams.length > 0 && <li>Included your practice midterm and left out the grading rubric.</li>}
            {edMine && (
              <li>
                Collected your answers on Ed ({edMine.meta.split('·')[0].trim()})
                {edTf ? `. Left out TF answers (${edTf.meta.split('·')[0].trim()}) until you’ve looked` : ''}.
              </li>
            )}
            <li>Prepared answers to {course.testQuestions.length} questions from your Ed history, each tied to the passage it comes from.</li>
          </ul>
        </section>

        <aside class="ov-side">
          <h2 class="section-title">What you control</h2>
          <dl class="controls">
            <div>
              <dt>
                <a class="control-link" href="#sources">You approve every source</a>
              </dt>
              <dd>The tutor answers only from what you approve. {p.approved > 0 ? `${p.approved} of ${src.length} approved so far.` : 'Nothing is approved yet.'}</dd>
            </div>
            <div>
              <dt>
                <a class="control-link" href="#questions">You see every question</a>
              </dt>
              <dd>Every question and answer is logged, grouped by topic, with student names hidden.</dd>
            </div>
            <div>
              <dt>
                <a class="control-link" href="#rules">It won’t solve problem sets</a>
              </dt>
              <dd>It explains ideas and points to your lectures. It never works or checks problem-set questions.</dd>
            </div>
            <div>
              <dt>
                <a class="control-link" href="#golive">The off switch is yours</a>
              </dt>
              <dd>Turn it off at any moment and it stops answering immediately.</dd>
            </div>
          </dl>

          <h2 class="section-title ov-sub">Recent changes</h2>
          {s.activity.length === 0 ? (
            <p class="muted">Your changes will be listed here, so you can always see what changed and when.</p>
          ) : (
            <ul class="activity">
              {s.activity.slice(0, 8).map((a, i) => (
                <li key={i}>
                  <span>{a.detail}</span>
                  <time class="muted tnum" dateTime={a.at}>
                    {relTime(a.at)}
                  </time>
                </li>
              ))}
            </ul>
          )}
          <p class="ov-contact muted small">
            Questions about the setup? Reply to the email you got from Lectern, or ask in your review meeting.
          </p>
        </aside>
      </div>
    </>
  )
}
