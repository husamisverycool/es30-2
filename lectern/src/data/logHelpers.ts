import type { LogEntry, Outcome } from './types'
import type { Topic } from './topics'

/** One sample-log entry. `at` is Eastern daylight time (-04:00). */
export function entry(
  id: string,
  at: string,
  student: string,
  topic: Topic,
  text: string,
  outcome: Outcome,
  body: string,
): LogEntry {
  return { id, at: `${at}:00-04:00`, student: `Student ${student}`, topic, text, answer: { outcome, body } }
}
