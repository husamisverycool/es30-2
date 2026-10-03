# Lectern: MVP for ES 30 Assignment 2b

Lectern gives a professor an AI tutor for their course, built only from materials they already produce: lecture recordings, slides, the syllabus, past exams and their own Ed answers. The professor approves every source, sees every question, keeps a rule against problem-set solutions, and owns the off switch.

**Live MVP:** _link added after publishing_

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
2. **Sources**: approve or leave out each of 34 sources, with a recommendation for each. Preview any transcript. Add her own files.
3. **Rules**: two locked rules that are part of the offer, four she can switch, a notation table, and her own rules in plain English. Each rule has a "Try it" button.
4. **Preview**: 20 real-style questions from her Ed history, a test chat, "Sounds right / Not how I'd say it", and "Why this answer", which shows the passages and rules behind each answer.
5. **Questions**: a written weekly digest, where the class is stuck by topic, questions per day, and the full log with student names hidden. A sample week shows what this looks like with 230 students.
6. **Go live**: the switch, a pause for a set time (for example during Midterm 1), and the Ed announcement with a preview of how it reads on Ed.
7. **Student view** (`#student`): the tutor the class would use. It has numbered citations that open the transcript at the timestamp, a locked "Hints, not solutions" mode, a notice that staff can read questions, and a paused state when she turns it off.

Open the console in one tab and the student view in another: switching the tutor off, approving a source, or asking a question updates the other tab immediately.

## What's real and what's faked

| Part | Status |
|---|---|
| Source approval, rules, corrections, pause, off switch, question log, activity log | **Real.** Saved in the browser and shared across tabs on the same device. There's no shared server, so a professor on another computer starts fresh. |
| Retrieval over approved sources (BM25 with chemistry-aware matching) | **Real.** Leaving out a source removes it from every answer straight away. |
| Problem-set guard | **Real.** It detects a named problem set, pasted problem numbers, and "just tell me the answer" phrasing. |
| Answers to new questions | **Real when the viewer is signed in to Claude**: Claude writes from the retrieved passages under her rules. Otherwise the tutor quotes the most relevant passages from her materials. |
| Answers to the 20 Ed-history questions and the 64-question sample week | **Prepared ahead.** Each one cites passages that exist in the sources. They stop being used if she leaves out a source they cite. |
| Course materials | **Fictional.** 13 lecture transcripts, 13 slide decks, a syllabus, PS4 solutions, PS5, a practice midterm, a rubric and Ed answers, all written for this demo in the persona's voice. |
| Canvas, Panopto, Ed integration; real video playback; accounts | **Not built.** The 2a plan does this by hand for three pilot courses. |

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
| `src/state/store.ts` | Local state with cross-tab sync and the activity log |
| `src/console/` | The professor console pages |
| `src/student/` | The student tutor |
| `src/shared/` | Chat, cited answers and the source viewer, used by both sides |
| `DESIGN.md`, `research/` | Where each design decision comes from, and the four research reports behind them |
