import type { Course } from '../data/types'
import { tokens } from './text'

let model: { topic: string; tf: Map<string, number>; total: number }[] | null = null

/** Topic of a new question, learned from the labelled questions shipped with the course. */
export function classify(question: string, course: Course): string {
  if (!model) {
    const by = new Map<string, Map<string, number>>()
    for (const q of [...course.testQuestions, ...course.sampleLog]) {
      const m = by.get(q.topic) ?? new Map<string, number>()
      for (const t of tokens(q.text)) m.set(t, (m.get(t) ?? 0) + 1)
      by.set(q.topic, m)
    }
    model = [...by].map(([topic, tf]) => ({ topic, tf, total: [...tf.values()].reduce((a, b) => a + b, 0) }))
  }
  const qt = tokens(question)
  let best = course.topics[course.topics.length - 1] ?? 'Other'
  let bestScore = 0
  for (const m of model) {
    let s = 0
    for (const t of qt) s += Math.log(1 + (m.tf.get(t) ?? 0) / (1 + m.total / 50))
    if (s > bestScore) {
      bestScore = s
      best = m.topic
    }
  }
  return bestScore > 0.15 ? best : 'Other'
}
