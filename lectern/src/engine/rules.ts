export interface Rule {
  id: string
  title: string
  detail: string
  /** Locked rules are part of the offer and cannot be switched off. */
  locked?: boolean
  defaultOn: boolean
  /** A question the professor can run to see the rule work. */
  tryIt?: string
}

export const RULES: Rule[] = [
  {
    id: 'no-pset',
    title: 'Never work or check current problem-set questions',
    detail:
      'When a student asks about a problem from the open problem set, the tutor gives one conceptual nudge and points to the lecture. It never gives steps, numbers or a final answer, and it won’t confirm whether an answer is right.',
    locked: true,
    defaultOn: true,
    tryIt: 'can someone just tell me the answer to ps5 3b? i got 0.0042 M',
  },
  {
    id: 'sources-only',
    title: 'Answer only from sources you approved',
    detail:
      'If your approved materials don’t cover a question, the tutor says so and suggests Ed or office hours. It does not fill gaps from general knowledge.',
    locked: true,
    defaultOn: true,
    tryIt: 'how do i use the henderson hasselbalch equation',
  },
  {
    id: 'cite',
    title: 'Point to the lecture and timestamp behind every answer',
    detail: 'Each claim links to the passage it came from, so students rewatch your explanation instead of trusting the tutor’s.',
    defaultOn: true,
  },
  {
    id: 'notation',
    title: 'Use my notation',
    detail: 'The tutor writes quantities and units the way you do in lecture.',
    defaultOn: true,
  },
  {
    id: 'tfs',
    title: 'Send grade, regrade and extension questions to the TFs',
    detail: 'The tutor quotes the relevant syllabus policy and tells the student who handles it. It never promises anything about a grade.',
    defaultOn: true,
    tryIt: 'i think problem 2 on ps3 was graded wrong, can i get points back?',
  },
  {
    id: 'exam',
    title: 'Don’t discuss what’s on an upcoming exam',
    detail: 'The tutor can share what the syllabus says the exam covers and point to the practice exam. Nothing else.',
    defaultOn: true,
    tryIt: 'what questions are going to be on midterm 1',
  },
]

export const ruleOn = (rules: Record<string, boolean>, id: string) => {
  const r = RULES.find((x) => x.id === id)
  if (r?.locked) return true
  return rules[id] ?? r?.defaultOn ?? false
}
