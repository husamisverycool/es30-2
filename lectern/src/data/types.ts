// Content model for a Lectern course. Everything the tutor knows lives in
// Source.passages; answers cite passages by id.

export type SourceKind = 'lecture' | 'slides' | 'syllabus' | 'pset' | 'exam' | 'ed' | 'upload'

/** How the tutor may use a source once the professor approves it.
 *  answer    – may quote and explain it to students
 *  recognize – used only to recognize current problem-set questions so the tutor can decline them */
export type SourceMode = 'answer' | 'recognize'

export type ReviewStatus = 'review' | 'approved' | 'excluded'

export interface Passage {
  /** Globally unique, e.g. "L11-04", "S10-07", "SYL-03", "PS5-2b", "ED-07" */
  id: string
  /** Human locator shown on citation chips: "23:14" for lectures, "Slide 7" for slides, "Late work" for syllabus sections, "Problem 2b" for psets */
  loc: string
  /** Seconds from start of recording, lectures only */
  seconds?: number
  text: string
}

export interface Source {
  id: string // "L11", "S11", "SYL", "PS5", "MT1-2025", "ED"
  kind: SourceKind
  title: string // "Lecture 11 · ICE tables and the small-x approximation"
  /** ISO date the material was delivered or posted */
  date?: string
  /** Short facts line, e.g. "51 min · Canvas recording" or "24 slides · PDF" */
  meta: string
  /** Where it came from, shown in the source drawer, e.g. "Canvas › Lecture recordings" */
  origin: string
  /** Status Lectern's setup person proposes before the professor reviews */
  proposed: ReviewStatus
  mode: SourceMode
  /** One-sentence note from the setup person explaining the proposal */
  note?: string
  passages: Passage[]
}

export type Outcome = 'answered' | 'declined_pset' | 'sent_to_tfs' | 'not_covered'

export interface Answer {
  outcome: Outcome
  /** Markdown-lite: paragraphs separated by a blank line, "- " bullets, **bold**,
   *  and citation markers written as [[PASSAGE_ID]] placed right after the claim they support. */
  body: string
}

export interface TestQuestion {
  id: string
  text: string
  /** Where it came from: "Ed #214 · PS3" etc. */
  from: string
  topic: string
  answer: Answer
}

export interface LogEntry {
  id: string
  /** ISO timestamp, Eastern time offset */
  at: string
  /** Anonymous student handle, e.g. "Student 0412" */
  student: string
  text: string
  topic: string
  answer: Answer
}

export interface Course {
  code: string
  title: string
  term: string
  professor: { name: string; short: string; title: string; email: string }
  tfs: string[]
  meets: string
  officeHours: string
  edCategoryForAnnouncement: string
  enrolled: number
  topics: string[]
  sources: Source[]
  testQuestions: TestQuestion[]
  sampleLog: LogEntry[]
  notation: { write: string; not: string }[]
}
