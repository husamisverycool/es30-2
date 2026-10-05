# Lectern: MVP for ES 30 Assignment 2b

Lectern gives a professor an AI tutor for their course, built only from materials they already produce: lecture recordings, slides, the syllabus, past exams and their own Ed answers. The professor approves every source, sees every question, keeps a rule against problem-set solutions, and owns the off switch.

**Live MVP:** https://claude.ai/artifact/Dsn1kNKUcrwKrWMKboUerX (professor console) · https://claude.ai/artifact/Dsn1kNKUcrwKrWMKboUerX#student (student view). For a public link anyone can open, put `lectern-netlify.zip` on Netlify (see below).

## The research question (from Assignment 2a)

> When professors of large lecture courses are offered a course-specific AI tutor set up entirely by someone else from their existing recordings and materials, with approval over every source, a log of every student question and an off switch, do at least three out of ten agree and hand over their materials within two weeks, and do at least two of those announce it to their class?

The riskiest assumption is supply: professors handing over their materials and putting their name on it. So the MVP is built around the professor's yes, not the student's experience. It answers the three fears in the persona (Prof. Ellen Marsh, intro chemistry, 230 students):

| Her fear | What the MVP shows her |
|---|---|
| "It will say something I never said, with my name on it." | Every source starts as **Needs review**. Answers cite the exact lecture timestamp or slide. She can rewrite any answer in her own words and the tutor uses her version from then on. |
| "It will do the problem sets." | The open problem set is loaded as **Recognize only**, so the tutor can spot its questions and decline them. It never quotes it. The rule is locked on, and she can try it herself. |
| "It will add work." | Lectern has already done the setup. The review is a four-step checklist of about 15 minutes, with "Accept recommendations" for the sources and a ready-to-post Ed announcement in her voice. |

It also covers the two behaviours the experiment measures:
- **Handing over materials:** the source review, and the option to add her own files (Panopto and Zoom caption files keep their timestamps).
- **Announcing it to the class:** "Copy post" and "I posted it on Ed". Both are recorded in the activity log.

## What a professor does with it

1. **Overview**: the 15-minute checklist, what was already done for her, and the four controls she keeps.
2. **Sources**: approve or leave out each of 33 sources, with a recommendation for each. Preview any transcript. Add her own files.
3. **Rules**: two locked rules that are part of the offer, four she can switch, a notation table, and her own rules in plain English. Each rule has a "Try it" button.
4. **Preview**: 20 real-style questions from her Ed history, a test chat, "Sounds right / Not how I'd say it", and "Why this answer", which shows the passages and rules behind each answer.
5. **Questions**: a written weekly digest, where the class is stuck by topic, questions per day, and the full log with student names hidden. A sample week shows what this looks like with 230 students.
6. **Go live**: the switch, a pause for a set time (for example during Midterm 1), and the Ed announcement with a preview of how it reads on Ed.
7. **Student view** (`#student`): the tutor the class would use. It has numbered citations that open the transcript at the timestamp, a locked "Hints, not solutions" mode, a notice that staff can read questions, and a paused state when she turns it off.
8. **The experiment** (`#experiment`, under "For the founder"): the research question, the four numbers from the 2a plan with their success and kill thresholds, a verdict that follows the 2a decision rules, a tracker for the ten professors, and the offer email. See below.

## A two-minute walk-through

1. **Overview**: the checklist, and what Lectern already did.
2. **Sources**: "Accept recommendations", then open a lecture transcript.
3. **Preview**: click an Ed question, open "Why this answer", then ask "can you just tell me the answer to ps5 3b" to see the decline.
4. **Go live**: turn it on, copy the Ed post, mark it posted.
5. **Student view** in a second tab: ask a question and click a citation. Turn the tutor off in the first tab and the second tab pauses.
6. **The experiment**: the scoreboard and "What this professor did here" now show the steps from 2–4.

## The experiment page

The console is what a professor sees. The experiment page is what the founder uses to run the test:

- **Scoreboard.** Replied within a week (target 6 of 10, kill under 2), handed over materials within two weeks (target 3, kill under 1), announced to the class (target 2, kill at none), and student usage in one pilot class (target 25%, kill under 5%). While the two-week window is open, low numbers read "Below target so far", not "kill".
- **Verdict.** Holds, revise ("they allow it but won't put their name on it"), kill, or in progress with what's still needed.
- **What this professor did here.** The console records each professor's behaviour: approving or adding sources (handing over materials), turning the tutor on or downloading the student page (agreeing), and marking the Ed post as posted (announcing). "Log this session to…" copies that onto their tracker row, so a review meeting turns straight into data.
- **Pilot tracker.** Ten rows. Changing a stage stamps the date, which drives the one- and two-week windows. Each no gets a reason (effort, accuracy, policy, fear of replacement). "Copy as CSV" pastes into a Google Sheet.
- **The offer email.** The same short email for all ten, linking to the working example.

A short note at the top of every console page ("ES 30 MVP. Testing one assumption…") links here, and can be hidden.

## Use it with a real course

Open the course menu at the top of the sidebar and choose **Set up your own course**. Enter the course code, title, your name and office hours. You get a blank course: add your syllabus and lectures in **Sources** (caption files keep their timestamps; PDFs and pasted text work too), try questions in **Preview**, set the rules, and turn it on. The CHEM 11 demo stays as it was, and the same menu switches between them.

**Giving students a link.** There's no server in this MVP, so your own course lives in your browser. To give students a working link today, go to **Go live → Link for students** and click **Download for Netlify**. Drag the .zip onto https://app.netlify.com/drop and you get a public link in about a minute. Alternatively, download the single .html file and upload it to Canvas Files. The downloaded page contains only the sources you approved, plus your rules and corrections. In this version it runs on its own: questions asked there stay on each student's device (the page tells students this), and the switch in the console doesn't reach it. To take it down, delete the Netlify site or the file.

## Claude-written answers outside the Claude viewer

In the Claude artifact viewer, new questions get Claude-written answers automatically. On Netlify, open **Settings** (the "…" next to your name) and paste an Anthropic API key. The key is checked with one small request, then stored in that browser only and sent only to Anthropic. It is never put in the build or in a downloaded student page. Answers are written by `claude-opus-5-5` from the retrieved passages under the professor's rules. If the key is missing, rejected or out of credit, the tutor goes back to quoting the passages. Prepared answers, the problem-set guard and staff routing never call a model.

Open the console in one tab and the student view in another: switching the tutor off, approving a source, or asking a question updates the other tab immediately.

## What's real and what's faked

| Part | Status |
|---|---|
| Source approval, rules, corrections, pause, off switch, question log, activity log | **Real.** Saved in the browser and shared across tabs on the same device. There's no shared server, so a professor on another computer starts fresh. |
| Retrieval over approved sources (BM25 with chemistry-aware matching) | **Real.** Leaving out a source removes it from every answer straight away. |
| Problem-set guard | **Real.** It detects a named problem set, pasted problem numbers, and "just tell me the answer" phrasing. |
| Answers to new questions | **Real when Claude is available**: in the Claude viewer, or anywhere once an API key is saved in Settings, Claude writes from the retrieved passages under her rules. Otherwise the tutor quotes the most relevant passages from her materials. |
| Her own course, and a student link for it | **Real.** Set up from the course menu. The downloadable student page works anywhere static files are hosted. Its questions stay on each student's device. |
| Experiment scoreboard and tracker | **Real.** It computes the 2a metrics and verdict from what you enter. Saved in this browser; "Copy as CSV" moves it to a sheet. |
| Answers to the 20 Ed-history questions and the 64-question sample week | **Prepared ahead.** Each one cites passages that exist in the sources. They stop being used if she leaves out a source they cite. |
| Course materials | **Fictional.** 13 lecture transcripts, 13 slide decks, a syllabus, PS4 solutions, PS5, a practice midterm, a rubric and Ed answers, all written for this demo in the persona's voice. |
| Canvas, Panopto, Ed integration; real video playback; accounts | **Not built.** The 2a plan does this by hand for three pilot courses. |

## Put it on Netlify

**Fastest (about a minute):** go to https://app.netlify.com/drop and drag `lectern-netlify.zip` (at the repo root) onto the page. Netlify gives you a public link right away. The student view is the same link with `#student` at the end.

**From Git:** connect this repo in Netlify. `netlify.toml` at the repo root already tells it to build `lectern/` and publish `lectern/dist`.

To rebuild the zip after changes: `cd lectern && npm run zip`.

On Netlify the tutor answers new questions by quoting the closest passages from the approved materials, unless you save an API key in Settings (see above). The prepared answers, problem-set guard, staff routing, corrections, switch, log and everything else work the same. Two tabs in the same browser (console and `#student`) stay in sync. The student link and the offer email use the Netlify address automatically.

## Run it

```bash
cd lectern
npm install
npm run dev        # local dev server
npm run build      # single-file build in dist/, plus dist/lectern.html for publishing
npm run typecheck
npx tsx scripts/validate-content.ts   # checks every citation resolves and the content counts
npx tsx scripts/try-tutor.ts "why is water left out of K"   # run questions through the engine
```

## Code map

| Path | What it is |
|---|---|
| `src/data/` | The fictional course: lectures, slides, syllabus, problem sets, exams, Ed answers, test questions, sample log |
| `src/engine/` | Search (`search.ts`), problem-set and logistics guards (`guard.ts`), the answer pipeline (`tutor.ts`), file ingestion for captions, text and PDF (`ingest.ts`), rules, topic tagging |
| `src/state/store.ts` | Local state per course, with cross-tab sync and the activity log |
| `src/state/workspace.ts`, `src/app/context.ts` | The demo course and the professor's own course, and switching between them |
| `src/state/pilot.ts`, `src/console/Experiment.tsx` | The experiment: scoreboard, 2a decision rules, tracker, CSV, offer email |
| `src/state/publish.ts` | Packs an own course into a standalone student page (.html, or .zip for Netlify Drop) |
| `src/engine/anthropic.ts` | Claude answers with the professor's API key (official SDK, streaming, server-side refusal fallback) |
| `src/console/` | The professor console pages |
| `src/student/` | The student tutor |
| `src/shared/` | Chat, cited answers and the source viewer, used by both sides |
| `DESIGN.md`, `research/` | Where each design decision comes from, and the four research reports behind them |
