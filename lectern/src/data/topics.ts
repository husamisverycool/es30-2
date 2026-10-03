// Canonical topic labels. Every TestQuestion and LogEntry uses one of these exactly.
export const TOPICS = [
  'Significant figures',
  'Stoichiometry',
  'Limiting reagent',
  'Solutions',
  'Gas laws',
  'Calorimetry',
  "Enthalpy & Hess's law",
  'Equilibrium expressions',
  'ICE tables',
  'Le Châtelier',
  'Acids & pH',
  'Course logistics',
] as const

export type Topic = (typeof TOPICS)[number]
