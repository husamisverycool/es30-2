// The demo course: CHEM 11 with Prof. Ellen Marsh, as of Saturday, October 3, 2026.
import type { Course } from './types'
import { TOPICS } from './topics'
import { lecturesA } from './lectures1'
import { lecturesB } from './lectures2'
import { lecturesC } from './lectures3'
import { slideDecks } from './slides'
import { materials, TFS } from './materials'
import { testQuestions } from './testQuestions'
import { sampleLogA } from './sampleLog1'
import { sampleLogB } from './sampleLog2'

export const course: Course = {
  code: 'CHEM 11',
  title: 'Foundations of Chemistry',
  term: 'Fall 2026',
  professor: {
    name: 'Ellen Marsh',
    short: 'Prof. Marsh',
    title: 'Senior Lecturer in Chemistry',
    email: 'emarsh@example.edu',
  },
  tfs: TFS,
  meets: 'Mon, Wed, Fri 10:30–11:20 am',
  officeHours: 'Prof. Marsh: Tue 2:00–3:30 pm · TF hours Sun–Thu 7–10 pm',
  edCategoryForAnnouncement: 'General',
  enrolled: 230,
  topics: [...TOPICS],
  sources: [...lecturesA, ...lecturesB, ...lecturesC, ...slideDecks, ...materials],
  testQuestions,
  sampleLog: [...sampleLogA, ...sampleLogB],
  notation: [
    { write: 'kJ mol⁻¹', not: 'kJ/mol' },
    { write: 'N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g)', not: 'N2 + 3H2 = 2NH3' },
    { write: '[NH₃] = 0.10 M', not: 'conc. NH3 = 0.10' },
    { write: 'ΔH°rxn = −92.2 kJ mol⁻¹', not: 'ΔH = 92.2 kJ (exothermic)' },
    { write: '1.8 × 10⁻⁵', not: '1.8e-5' },
    { write: 'R = 0.08206 L atm mol⁻¹ K⁻¹', not: 'R = 0.08206' },
    { write: '−x, −3x, +2x (one x, scaled by coefficients)', not: 'x, y, 2y' },
    { write: 'Kc = [CO₂]', not: 'Kc = [CaO][CO₂]/[CaCO₃]' },
  ],
}

export default course
