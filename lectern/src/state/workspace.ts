// Which course the console is showing: the CHEM 11 demo, or a course the professor set up herself.
import type { Course } from '../data/types'

export interface CourseMeta {
  code: string
  title: string
  term: string
  profName: string
  profShort: string
  profTitle: string
  officeHours: string
  enrolled: number
  edCategory: string
}

export interface Workspace {
  active: 'demo' | 'mine'
  mine: CourseMeta | null
}

export const WORKSPACE_KEY = 'lectern:workspace:v1'

export function loadWorkspace(): Workspace {
  try {
    const raw = localStorage.getItem(WORKSPACE_KEY)
    if (raw) {
      const w = JSON.parse(raw)
      if (w && (w.active === 'demo' || w.active === 'mine')) return { active: w.mine ? w.active : 'demo', mine: w.mine ?? null }
    }
  } catch {
    /* storage blocked */
  }
  return { active: 'demo', mine: null }
}

export function saveWorkspace(w: Workspace) {
  try {
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(w))
  } catch {
    /* storage blocked: the switch lasts for this page only */
  }
}

/** A blank course built from what the professor typed in; her uploads become its sources. */
export function buildCourse(m: CourseMeta): Course {
  return {
    code: m.code.trim() || 'My course',
    title: m.title.trim() || 'Untitled course',
    term: m.term.trim(),
    professor: { name: m.profName.trim() || 'Your name', short: m.profShort.trim() || m.profName.trim() || 'Your professor', title: m.profTitle.trim(), email: '' },
    tfs: [],
    meets: '',
    officeHours: m.officeHours.trim() || 'see the syllabus',
    edCategoryForAnnouncement: m.edCategory.trim() || 'General',
    enrolled: Math.max(0, Number(m.enrolled) || 0),
    topics: [],
    sources: [],
    testQuestions: [],
    sampleLog: [],
    notation: [],
  }
}

export const blankMeta = (): CourseMeta => ({
  code: '',
  title: '',
  term: 'Fall 2026',
  profName: '',
  profShort: '',
  profTitle: '',
  officeHours: '',
  enrolled: 0,
  edCategory: 'General',
})
