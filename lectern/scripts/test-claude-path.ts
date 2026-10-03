// Exercise the Claude-written answer path with a fake `sample` capability:
// checks the prompt carries only approved passages, the OUTCOME line is parsed and hidden while streaming,
// and citations to passages the tutor wasn't given are dropped.
import { course } from '../src/data/course'
import { ask, type TutorContext } from '../src/engine/tutor'

let prompt = ''
const fake = async (input: string, opts: { onText?: (u: { text: string; delta: string }) => void }) => {
  prompt = input
  const ids = [...input.matchAll(/^\[([A-Z0-9-]+)\] /gm)].map((m) => m[1])
  const text = `OUTCOME: answered\n\nCompressing the container raises every partial pressure, so the reaction shifts toward fewer moles of gas. [[${ids[0]}]] Adding argon at constant volume changes nothing. [[NOT-A-REAL-ID]]`
  let acc = ''
  for (const ch of text.match(/.{1,12}/gs) ?? []) {
    acc += ch
    opts.onText?.({ text: acc, delta: ch })
  }
  return { text, truncated: false }
}
;(globalThis as any).window = { claude: { use: async () => fake } }

const ctx: TutorContext = {
  course,
  sources: course.sources,
  approved: (id) => course.sources.find((s) => s.id === id)?.proposed === 'approved',
  rules: {},
  customRules: ['When a student asks about pressure, remind them to say what happened to Q.'],
  corrections: [],
}
const streamed: string[] = []
const r = await ask('if i squeeze the container to half the volume which way does it shift', ctx, { fresh: true, onText: (b) => streamed.push(b) })
const fail = (m: string) => {
  console.error('FAIL:', m)
  process.exitCode = 1
}
if (r.method !== 'claude') fail(`method ${r.method}`)
if (r.answer.outcome !== 'answered') fail(`outcome ${r.answer.outcome}`)
if (r.answer.body.includes('NOT-A-REAL-ID')) fail('unknown citation kept')
if (streamed.some((s) => s.includes('OUTCOME'))) fail('OUTCOME line leaked into the stream')
if (/\[PS5-/.test(prompt)) fail('recognize-only problem set text reached the prompt')
if (/\[MT1-2025-R/.test(prompt)) fail('excluded rubric reached the prompt')
if (!prompt.includes('remind them to say what happened to Q')) fail('custom rule missing from prompt')
console.log(r.answer.body)
console.log(process.exitCode ? 'Claude path: FAILED' : 'Claude path: ok')
