import type { Passage, Source } from '../data/types'
import { fold, numbers, overlap } from './text'

export interface PsetMatch {
  source: Source
  passage?: Passage
  reason: 'named' | 'copied' | 'asked-for-answer'
}

const ASKS_FOR_ANSWER =
  /\b(what('?s| is) the answer|just (tell|give) me|is (the answer|it) [-\d.]|did i get|check (my|this|if)|am i right|is this right|correct answer|final answer|solve (this|it|problem|number|#)|work (it|this) out|do (number|problem|#))\b/

/** Which problem set is the one currently open? The highest-numbered recognize-only set. */
function psetNumber(source: Source): number | null {
  const m = source.title.match(/problem set\s*(\d+)/i) ?? source.id.match(/PS(\d+)/i)
  return m ? Number(m[1]) : null
}

/**
 * Decide whether a question is asking the tutor to do current problem-set work.
 * Uses the recognize-only sources the professor approved; nothing from them is ever shown.
 */
export function matchPset(question: string, recognize: Source[]): PsetMatch | null {
  if (!recognize.length) return null
  const f = fold(question)
  const asks = ASKS_FOR_ANSWER.test(f)

  // 1. Named directly: "ps5 #3b", "problem set 5 question 2", "pset 5 2a".
  for (const source of recognize) {
    const n = psetNumber(source)
    if (n == null) continue
    const named = new RegExp(`\\b(ps|pset|p-set|problem set|hw|homework)\\s*#?\\s*${n}\\b`).test(f)
    if (!named) continue
    const part = f.match(/\b(?:problem|question|q|#|number|no\.?)\s*(\d+)\s*\(?([a-h])?\)?/) ??
      f.match(/\b(\d)([a-h])\b/)
    let passage: Passage | undefined
    if (part) {
      const want = `${part[1]}${part[2] ?? ''}`.toLowerCase()
      passage =
        source.passages.find((p) => p.loc.toLowerCase().replace(/[^0-9a-z]/g, '').endsWith(want)) ??
        source.passages.find((p) => p.loc.toLowerCase().replace(/[^0-9a-z]/g, '').includes(part[1]))
    }
    return { source, passage, reason: 'named' }
  }

  // 2. Copied problem text: shares specific numbers and wording with a problem.
  const qn = new Set(numbers(question))
  let best: { source: Source; passage: Passage; s: number } | null = null
  for (const source of recognize) {
    for (const passage of source.passages) {
      const pn = numbers(passage.text)
      const shared = pn.filter((x) => qn.has(x)).length
      const s = overlap(question, passage.text) + Math.min(0.45, shared * 0.18)
      if (!best || s > best.s) best = { source, passage, s }
    }
  }
  if (best && (best.s >= 0.55 || (asks && best.s >= 0.38))) {
    return { source: best.source, passage: best.passage, reason: asks ? 'asked-for-answer' : 'copied' }
  }
  // 3. "Problem 4b" with an answer request but no set named: the open set is the likely target.
  if (asks && /\b(problem|question|q|#|number)\s*\d+\s*[a-h]?\b/.test(f)) {
    return { source: recognize[recognize.length - 1], reason: 'asked-for-answer' }
  }
  return null
}

const LOGISTICS =
  /\b(regrade|re-grade|extension|extend|late (pass|day|submission|work)|turn(ed)? in late|grade[sd]?\b|my score|points? (off|back)|curve|dean'?s excuse|sick|absence|accommodat|drop the class|missed (the )?(midterm|exam|quiz))\b/

export function isLogistics(question: string): boolean {
  return LOGISTICS.test(fold(question))
}

const EXAM_CONTENT = /\b(what('?s| is| will be) on the (midterm|exam|final)|exam questions|leak|this year'?s (midterm|exam))\b/
export function asksExamContent(question: string): boolean {
  return EXAM_CONTENT.test(fold(question))
}
