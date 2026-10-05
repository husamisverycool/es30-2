import { useRef, useState } from 'preact/hooks'
import { allSources, course, isDemo, statusOf } from '../app/context'
import { CONSOLE_URL } from '../app/config'
import { useStore, type ActivityKind } from '../state/store'
import { addRow, grade, REASONS, windowOpen, scoreboard, setStage, STAGES, toCsv, updatePilot, usePilot, verdict, type Reason, type Stage } from '../state/pilot'
import { IconCheck, IconCopy, IconPlus } from '../ui/icons'
import { Button, Status, copyText, cx, fmtDay, fmtTime, plural, toast } from '../ui/kit'
import { PageHead } from './Console'

export const RESEARCH_QUESTION =
  'When professors of large lecture courses are offered a course-specific AI tutor set up entirely by someone else from their existing recordings and materials, with approval over every source, a log of every student question and an off switch, do at least three out of ten agree and hand over their materials within two weeks, and do at least two of those announce it to their class?'

function offerEmail(sender: string) {
  return {
    subject: 'A tutor for your course, built from your own lectures',
    body: `Dear Professor [name],

I'm a student building course-specific study tutors for large lecture courses, and I'd like to set one up for [course] this term, at no cost to you.

I build it from the recordings and materials you already post. You approve every source before it goes in. You see every question students ask. It explains concepts and points to your lectures, and it will not produce a problem-set solution. You can turn it off at any time.

It takes one fifteen-minute meeting. Here is a working example for an intro chemistry course: ${CONSOLE_URL}

Would you be open to trying it?

Best,
${sender || '[your name]'}`,
  }
}

const BEHAVIOR: { title: string; kinds: ActivityKind[]; why: string }[] = [
  { title: 'Handed over materials', kinds: ['approved', 'added-source'], why: 'Approved sources or added their own files' },
  { title: 'Agreed to run it', kinds: ['live-on', 'published-page'], why: 'Turned the tutor on, or downloaded the student page' },
  { title: 'Announced it to the class', kinds: ['posted-announcement'], why: 'Marked the Ed announcement as posted' },
]

export function Experiment() {
  const s = useStore()
  const pilot = usePilot()
  const sb = scoreboard(pilot)
  const v = verdict(sb)
  const settled = !windowOpen(sb)
  const [sendTo, setSendTo] = useState('')
  const emailRef = useRef<HTMLPreElement>(null)
  const email = offerEmail(pilot.sender)
  const approved = allSources(s).filter((x) => statusOf(s, x) === 'approved').length
  const firstOf = (kinds: ActivityKind[]) => [...s.activity].reverse().find((a) => kinds.includes(a.kind))
  const studentQs = s.log.length

  const tiles = [
    { label: 'Replied within a week', value: `${sb.replied} of ${sb.n}`, g: grade(sb.contacted ? sb.replied : null, 6, 2, false, settled), rule: 'Target 6 or more · kill under 2' },
    { label: 'Handed over materials within two weeks', value: `${sb.handed} of ${sb.n}`, g: grade(sb.contacted ? sb.handed : null, 3, 1, false, settled), rule: 'Target 3 or more · kill under 1' },
    { label: 'Of those, announced it to their class', value: `${sb.announced}`, g: grade(sb.handed ? sb.announced : null, 2, 0, true, settled), rule: 'Target 2 or more · kill at none' },
    {
      label: 'Students who asked at least one question (side signal)',
      value: sb.usage == null ? '—' : `${Math.round(sb.usage)}%`,
      g: grade(sb.usage, 25, 5),
      rule: 'Target 25% · kill under 5%',
    },
  ]

  // Map what this browser recorded onto a tracker row.
  const sessionStage: Stage | null = firstOf(['posted-announcement'])
    ? 'announced'
    : firstOf(['live-on', 'published-page'])
      ? 'live'
      : firstOf(['approved', 'added-source'])
        ? 'handed_over'
        : null

  return (
    <>
      <PageHead
        title="The experiment"
        sub="What this MVP is testing and the numbers that decide it. This page is for you, the founder; professors work in the pages above."
      />

      <section class="exp-question" aria-labelledby="rq">
        <h2 id="rq" class="section-title">
          Research question
        </h2>
        <blockquote class="rq">{RESEARCH_QUESTION}</blockquote>
        <dl class="exp-facts">
          <div>
            <dt>Riskiest assumption</dt>
            <dd>Professors will hand over their materials and endorse an AI that speaks for them, despite fearing it will be wrong in their name, do the homework, or make them look replaceable.</dd>
          </div>
          <div>
            <dt>Persona</dt>
            <dd>Prof. Ellen Marsh, senior lecturer, 230-student intro chemistry course, six TFs, reads all 400 Ed posts a semester.</dd>
          </div>
          <div>
            <dt>How the MVP tests it</dt>
            <dd>
              A professor gets a working tutor already built from her materials. In about 15 minutes she approves sources, checks the rules, tries it, turns it on and copies an Ed
              announcement. Each of those is a commitment, and each one is recorded.
            </dd>
          </div>
        </dl>
      </section>

      <section class="exp-section" aria-labelledby="score">
        <div class="section-head">
          <h2 id="score" class="section-title">
            Scoreboard
          </h2>
          <span class="muted small">{sb.contacted ? `${sb.contacted} contacted${sb.daysIn != null ? ` · day ${sb.daysIn}` : ''}` : 'From the tracker below'}</span>
        </div>
        <div class="tiles">
          {tiles.map((t) => (
            <div key={t.label} class="tile">
              <div class="tile-label">{t.label}</div>
              <div class="tile-value">{t.value}</div>
              <Status tone={t.g.tone === 'muted' ? 'muted' : t.g.tone}>{t.g.word}</Status>
              <div class="tile-rule">{t.rule}</div>
            </div>
          ))}
        </div>
        <p class={cx('verdict', `verdict-${v.tone}`)}>{v.text}</p>
      </section>

      <section class="exp-section" aria-labelledby="session">
        <h2 id="session" class="section-title">
          What this professor did here
        </h2>
        <p class="muted">Recorded in this browser while the console was used. Run one session per professor, then log it to their row.</p>
        <ol class="behaviors">
          {BEHAVIOR.map((b) => {
            const a = firstOf(b.kinds)
            return (
              <li key={b.title} class={cx(a && 'is-done')}>
                <span class="behavior-dot" aria-hidden="true">
                  {a ? <IconCheck size={13} /> : null}
                </span>
                <div>
                  <div class="behavior-title">{b.title}</div>
                  <div class="muted small">
                    {a ? `${a.detail} · ${fmtDay(a.at)}, ${fmtTime(a.at)}` : `Not yet. ${b.why}.`}
                    {b.title === 'Handed over materials' && a ? ` · ${plural(approved, 'source')} approved now` : ''}
                  </div>
                </div>
              </li>
            )
          })}
          <li class={cx(studentQs > 0 && 'is-done')}>
            <span class="behavior-dot" aria-hidden="true">
              {studentQs ? <IconCheck size={13} /> : null}
            </span>
            <div>
              <div class="behavior-title">Students asked questions</div>
              <div class="muted small">{studentQs ? `${studentQs} question${studentQs === 1 ? '' : 's'} in the student view` : 'None yet in this browser.'}</div>
            </div>
          </li>
        </ol>
        <div class="log-session">
          <label class="sr-only" for="log-to">
            Professor
          </label>
          <select id="log-to" class="select select-sm" value={sendTo} onChange={(e) => setSendTo((e.target as HTMLSelectElement).value)}>
            <option value="">Log this session to…</option>
            {pilot.rows.map((r, i) => (
              <option key={r.id} value={r.id}>
                {r.name || `Row ${i + 1}`}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            variant="secondary"
            disabled={!sendTo || !sessionStage}
            onClick={() => {
              if (!sessionStage) return
              setStage(sendTo, sessionStage)
              updatePilot((p) => {
                const r = p.rows.find((x) => x.id === sendTo)
                if (r && !r.course) r.course = isDemo() ? '' : `${course.code} · ${course.title}`
              })
              toast(`Logged: ${STAGES.find((x) => x.id === sessionStage)?.label}`)
            }}
          >
            Log it
          </Button>
          {!sessionStage && <span class="muted small">Nothing to log yet.</span>}
        </div>
      </section>

      <section class="exp-section" aria-labelledby="tracker">
        <div class="section-head">
          <h2 id="tracker" class="section-title">
            Pilot tracker
          </h2>
          <span class="tracker-actions">
            <Button
              size="sm"
              variant="ghost"
              icon={<IconCopy size={15} />}
              onClick={async () => toast((await copyText(toCsv(pilot))) ? 'Copied as CSV. Paste it into a Google Sheet.' : 'Copy didn’t work in this browser.')}
            >
              Copy as CSV
            </Button>
            <Button size="sm" variant="ghost" icon={<IconPlus size={15} />} onClick={addRow}>
              Add a row
            </Button>
          </span>
        </div>
        <p class="muted">The ten professors from the plan. Changing a stage stamps the date, which the scoreboard uses for the one- and two-week windows.</p>
        <div class="table-wrap">
          <table class="table tracker">
            <thead>
              <tr>
                <th>Professor</th>
                <th>Department</th>
                <th>Course</th>
                <th>Stage</th>
                <th>If no, why</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {pilot.rows.map((r, i) => (
                <tr key={r.id}>
                  <td>
                    <input class="cell" aria-label={`Row ${i + 1} professor`} value={r.name} placeholder={`Professor ${i + 1}`} onChange={(e) => updatePilot((p) => void (p.rows[i].name = (e.target as HTMLInputElement).value))} />
                  </td>
                  <td>
                    <input class="cell" aria-label={`Row ${i + 1} department`} value={r.dept} placeholder="Department" onChange={(e) => updatePilot((p) => void (p.rows[i].dept = (e.target as HTMLInputElement).value))} />
                  </td>
                  <td>
                    <input class="cell" aria-label={`Row ${i + 1} course`} value={r.course} placeholder="Course · size" onChange={(e) => updatePilot((p) => void (p.rows[i].course = (e.target as HTMLInputElement).value))} />
                  </td>
                  <td>
                    <select class="cell cell-select" aria-label={`Row ${i + 1} stage`} value={r.stage} onChange={(e) => setStage(r.id, (e.target as HTMLSelectElement).value as Stage)}>
                      {STAGES.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.label}
                        </option>
                      ))}
                    </select>
                    {r.at[r.stage] && r.stage !== 'not_contacted' && <div class="cell-date">{fmtDay(r.at[r.stage]!)}</div>}
                  </td>
                  <td>
                    {r.stage === 'declined' ? (
                      <select class="cell cell-select" aria-label={`Row ${i + 1} reason`} value={r.reason} onChange={(e) => updatePilot((p) => void (p.rows[i].reason = (e.target as HTMLSelectElement).value as Reason))}>
                        <option value="">Choose…</option>
                        {REASONS.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span class="muted small">—</span>
                    )}
                  </td>
                  <td>
                    <input class="cell" aria-label={`Row ${i + 1} notes`} value={r.notes} placeholder="Notes" onChange={(e) => updatePilot((p) => void (p.rows[i].notes = (e.target as HTMLInputElement).value))} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div class="pilot-extra">
          <div class="field">
            <span class="field-label">Pilot class usage</span>
            <div class="usage-row">
              <input
                id="usage-asked"
                class="input input-num"
                type="number"
                min={0}
                aria-label="Students who asked at least one question"
                value={pilot.students.asked || ''}
                placeholder="0"
                onChange={(e) => updatePilot((p) => void (p.students.asked = Number((e.target as HTMLInputElement).value) || 0))}
              />
              <span class="muted">of</span>
              <input
                id="usage-enrolled"
                class="input input-num"
                type="number"
                min={0}
                aria-label="Students enrolled"
                value={pilot.students.enrolled || ''}
                placeholder="230"
                onChange={(e) => updatePilot((p) => void (p.students.enrolled = Number((e.target as HTMLInputElement).value) || 0))}
              />
              <span class="muted">students asked at least one question in one problem-set cycle</span>
            </div>
          </div>
          {sb.declined > 0 && (
            <div class="reasons">
              <span class="field-label">Why professors said no</span>
              <ul>
                {REASONS.filter((x) => sb.reasons[x]).map((x) => (
                  <li key={x}>
                    <span>{x}</span>
                    <span class="reason-bar" style={{ width: `${(sb.reasons[x] / sb.declined) * 100}%` }} />
                    <span class="tnum">{sb.reasons[x]}</span>
                  </li>
                ))}
              </ul>
              {(() => {
                const unset = sb.declined - REASONS.reduce((n, x) => n + (sb.reasons[x] ?? 0), 0)
                return unset > 0 ? (
                  <p class="muted small">
                    {unset === 1 ? '1 professor' : `${unset} professors`} said no without a reason logged. Pick one in the “If no, why” column.
                  </p>
                ) : null
              })()}
            </div>
          )}
        </div>
      </section>

      <section class="exp-section" aria-labelledby="offer">
        <div class="section-head">
          <h2 id="offer" class="section-title">
            The offer email
          </h2>
          <Button
            size="sm"
            variant="secondary"
            icon={<IconCopy size={15} />}
            onClick={async () => {
              const ok = await copyText(`Subject: ${email.subject}\n\n${email.body}`, emailRef.current)
              toast(ok ? 'Email copied' : 'Selected. Copy it with your keyboard.')
            }}
          >
            Copy email
          </Button>
        </div>
        <p class="muted">Same text to all ten, kept short and factual so you test the offer, not your salesmanship. It links to the working example.</p>
        <div class="field sender">
          <label class="field-label" for="sender">
            Signed by
          </label>
          <input id="sender" class="input" value={pilot.sender} placeholder="Your name" onChange={(e) => updatePilot((p) => void (p.sender = (e.target as HTMLInputElement).value))} />
        </div>
        <div class="email">
          <div class="email-subject">
            <span class="muted">Subject</span> {email.subject}
          </div>
          <pre class="email-body" ref={emailRef}>
            {email.body}
          </pre>
        </div>
      </section>

      <section class="exp-section" aria-labelledby="real">
        <h2 id="real" class="section-title">
          What’s real and what’s faked
        </h2>
        <ul class="done-list">
          <li>
            <strong>Real:</strong> source approval, rules, corrections, the on/off switch and pause, the question log, file uploads (captions, PDFs, text), retrieval over approved
            sources, the problem-set guard, staff routing, and Claude-written answers when a key is set or inside the Claude viewer.
          </li>
          <li>
            <strong>Faked:</strong> the CHEM 11 materials are fictional; the 20 Ed questions and the sample week are prepared; there is no shared server, so saved state lives in one
            browser; no Canvas, Panopto or Ed integration.
          </li>
          <li>
            <strong>Done by hand in a real pilot:</strong> transcribing a professor’s recordings and loading them, as the 2a plan describes.
          </li>
        </ul>
      </section>
    </>
  )
}
