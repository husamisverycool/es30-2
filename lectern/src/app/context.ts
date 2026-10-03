import { useMemo } from 'preact/hooks'
import { course } from '../data/course'
import type { Passage, ReviewStatus, Source } from '../data/types'
import type { TutorContext } from '../engine/tutor'
import { useStore, type State } from '../state/store'

export { course }

export function allSources(s: State): Source[] {
  return [...course.sources, ...s.uploads]
}

/** A source's status: the professor's decision, or "review" until she makes one. Her own uploads start approved. */
export function statusOf(s: State, src: Source): ReviewStatus {
  return s.statuses[src.id] ?? (src.origin === 'Added by you' ? 'approved' : 'review')
}

export function tutorContext(s: State): TutorContext {
  const sources = allSources(s)
  const byId = new Map(sources.map((x) => [x.id, x]))
  return {
    course,
    sources,
    approved: (id) => {
      const src = byId.get(id)
      return !!src && statusOf(s, src) === 'approved'
    },
    rules: s.rules,
    customRules: s.customRules.map((r) => r.text),
    corrections: s.corrections,
  }
}

export function useTutorContext() {
  const s = useStore()
  return useMemo(() => tutorContext(s), [s.statuses, s.uploads, s.rules, s.customRules, s.corrections])
}

export function usePassageMap() {
  const s = useStore()
  return useMemo(() => {
    const m = new Map<string, { passage: Passage; source: Source }>()
    for (const source of allSources(s)) for (const passage of source.passages) m.set(passage.id, { passage, source })
    return m
  }, [s.uploads])
}

export const prof = course.professor

export function reviewProgress(s: State) {
  const sources = allSources(s)
  const decided = sources.filter((x) => statusOf(s, x) !== 'review').length
  const approved = sources.filter((x) => statusOf(s, x) === 'approved').length
  return { total: sources.length, decided, approved, pending: sources.length - decided }
}
