import { useMemo } from 'preact/hooks'
import { course as demoCourse } from '../data/course'
import type { Course, Passage, ReviewStatus, Source } from '../data/types'
import type { TutorContext } from '../engine/tutor'
import { resetClassifier } from '../engine/classify'
import { touch, useCourseState, useStore, type State } from '../state/store'
import { published } from '../state/publish'
import { buildCourse, loadWorkspace, saveWorkspace, WORKSPACE_KEY, type CourseMeta, type Workspace } from '../state/workspace'

// The active course. These are live bindings: switching courses reassigns them and every importer sees the change.
export let course: Course = demoCourse
export let prof = course.professor
export let workspace: Workspace = loadWorkspace()

export const isDemo = () => course === demoCourse
export const demo = demoCourse

function apply(w: Workspace) {
  if (published) {
    // A downloaded student page: one course, the professor's decisions fixed at download time.
    workspace = { active: 'mine', mine: published.meta }
    course = buildCourse(published.meta)
    prof = course.professor
    resetClassifier()
    useCourseState(`pub-${published.id}`, { ...published.state, live: true, pause: undefined })
    return
  }
  workspace = w
  course = w.active === 'mine' && w.mine ? buildCourse(w.mine) : demoCourse
  prof = course.professor
  resetClassifier()
  useCourseState(w.active === 'mine' ? 'mine' : 'demo')
}
apply(workspace)

/** Switch courses, or save new details for the professor's own course. */
export function setWorkspace(w: Workspace) {
  saveWorkspace(w)
  apply(w)
  touch()
}

export function setOwnCourse(meta: CourseMeta, activate = true) {
  setWorkspace({ active: activate ? 'mine' : workspace.active, mine: meta })
}

// A switch made in another tab (say, the student view) follows here too.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === WORKSPACE_KEY && !published) {
      apply(loadWorkspace())
      touch()
    }
  })
}

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
  return useMemo(() => tutorContext(s), [s.statuses, s.uploads, s.rules, s.customRules, s.corrections, course])
}

export function usePassageMap() {
  const s = useStore()
  return useMemo(() => {
    const m = new Map<string, { passage: Passage; source: Source }>()
    for (const source of allSources(s)) for (const passage of source.passages) m.set(passage.id, { passage, source })
    return m
  }, [s.uploads, course])
}

export function reviewProgress(s: State) {
  const sources = allSources(s)
  const decided = sources.filter((x) => statusOf(s, x) !== 'review').length
  const approved = sources.filter((x) => statusOf(s, x) === 'approved').length
  return { total: sources.length, decided, approved, pending: sources.length - decided }
}
