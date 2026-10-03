// Run questions through the tutor engine with every source approved, as a quick retrieval check.
// Usage: npx tsx scripts/try-tutor.ts ["question" ...]
import { course } from '../src/data/course'
import { ask, type TutorContext } from '../src/engine/tutor'

const ctx: TutorContext = {
  course,
  sources: course.sources,
  approved: (id) => course.sources.find((s) => s.id === id)?.proposed === 'approved',
  rules: {},
  customRules: [],
  corrections: [],
}

const qs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      'what happens to K if i double the volume',
      'why does adding argon not shift anything',
      'how do i know which reactant is limiting',
      'do i round in the middle of a problem',
      'what is the 5% rule',
      'is the answer to ps5 2a 3.4?',
      'can i get an extension on ps5',
      'what is on midterm 1',
      'how does a buffer work',
      'explain molecular orbital theory',
      'which value of R should I use',
      'why is water left out of the equilibrium expression',
    ]

for (const q of qs) {
  const r = await ask(q, ctx, { fresh: true })
  console.log(`\n### ${q}\n[${r.answer.outcome} · ${r.method}] read: ${r.read.slice(0, 4).map((h) => `${h.passage.id}(${h.score.toFixed(1)})`).join(' ')}`)
  console.log(r.answer.body.slice(0, 600))
}
