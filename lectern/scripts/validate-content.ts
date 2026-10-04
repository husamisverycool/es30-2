// Validates the demo course content in src/data.
// Run: npx tsx scripts/validate-content.ts
import { course } from '../src/data/course'
import type { Answer, Outcome, Passage, Source } from '../src/data/types'

const errors: string[] = []
const warnings: string[] = []
const fail = (msg: string) => errors.push(msg)
const warn = (msg: string) => warnings.push(msg)

// ---------- index ----------
const passageById = new Map<string, { passage: Passage; source: Source }>()
const allIds = new Map<string, string>() // id -> what it is
function claimId(id: string, what: string) {
  const prev = allIds.get(id)
  if (prev) fail(`Duplicate id "${id}" (${prev} and ${what})`)
  else allIds.set(id, what)
}

for (const s of course.sources) {
  claimId(s.id, `source ${s.id}`)
  for (const p of s.passages) {
    claimId(p.id, `passage in ${s.id}`)
    passageById.set(p.id, { passage: p, source: s })
  }
}
for (const q of course.testQuestions) claimId(q.id, 'test question')
for (const e of course.sampleLog) claimId(e.id, 'log entry')

const words = (t: string) => t.replace(/\[\[[^\]]+\]\]/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length

// ---------- sources ----------
const lectures = course.sources.filter((s) => s.kind === 'lecture')
const decks = course.sources.filter((s) => s.kind === 'slides')
if (lectures.length !== 13) fail(`Expected 13 lectures, found ${lectures.length}`)
if (decks.length !== 13) fail(`Expected 13 slide decks, found ${decks.length}`)

const toSeconds = (loc: string) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(loc)
  return m ? Number(m[1]) * 60 + Number(m[2]) : NaN
}

for (const s of lectures) {
  if (s.passages.length < 10 || s.passages.length > 14) fail(`${s.id}: ${s.passages.length} passages (want 10–14)`)
  let last = -1
  s.passages.forEach((p, i) => {
    const expectId = `${s.id}-${String(i + 1).padStart(2, '0')}`
    if (p.id !== expectId) fail(`${s.id}: passage ${i + 1} has id ${p.id}, expected ${expectId}`)
    const secs = toSeconds(p.loc)
    if (Number.isNaN(secs)) fail(`${p.id}: loc "${p.loc}" is not m:ss`)
    if (p.seconds !== secs) fail(`${p.id}: seconds ${p.seconds} do not match loc ${p.loc} (${secs})`)
    if ((p.seconds ?? -1) <= last) fail(`${p.id}: seconds do not ascend`)
    if ((p.seconds ?? 0) > 52 * 60) fail(`${p.id}: beyond a ~50-minute lecture`)
    last = p.seconds ?? last
    const n = words(p.text)
    if (n < 60 || n > 110) fail(`${p.id}: ${n} words (want 60–110)`)
  })
}
for (const s of decks) {
  if (s.passages.length < 5 || s.passages.length > 8) fail(`${s.id}: ${s.passages.length} slides (want 5–8)`)
  for (const p of s.passages) {
    const num = Number(/^Slide (\d+)$/.exec(p.loc)?.[1])
    if (!num) fail(`${p.id}: loc "${p.loc}" should be "Slide N"`)
    if (p.id !== `${s.id}-${String(num).padStart(2, '0')}`) fail(`${p.id}: id does not match ${p.loc}`)
    if (!p.text.includes(' · ')) fail(`${p.id}: slide text should be "Title · bullet · …"`)
  }
}
const recognizeSources = course.sources.filter((s) => s.mode === 'recognize').map((s) => s.id)
if (recognizeSources.join() !== 'PS5') fail(`Only PS5 should be mode "recognize" (found ${recognizeSources.join(', ')})`)
for (const s of course.sources) {
  for (const p of s.passages) {
    if (/kJ\/mol/.test(p.text)) fail(`${p.id}: writes kJ/mol (use kJ mol⁻¹)`)
    if (/\\\(|\\frac|\$/.test(p.text)) fail(`${p.id}: looks like LaTeX`)
  }
}

// ---------- answers ----------
const useOfAi = course.sources.find((s) => s.id === 'SYL')?.passages.find((p) => p.loc === 'Use of AI')?.id
if (!useOfAi) fail('Syllabus has no "Use of AI" passage')
const ps5Decimals = new Set(
  (course.sources.find((s) => s.id === 'PS5')?.passages ?? []).flatMap((p) => p.text.match(/\d+\.\d+/g) ?? []),
)

function checkAnswer(label: string, a: Answer) {
  const cites = [...a.body.matchAll(/\[\[([^\]]+)\]\]/g)].map((m) => m[1])
  const distinct = new Set(cites)
  for (const id of distinct) {
    const hit = passageById.get(id)
    if (!hit) fail(`${label}: cites unknown passage [[${id}]]`)
    else if (hit.source.mode === 'recognize') fail(`${label}: cites [[${id}]] from recognize-only source ${hit.source.id}`)
    else if (hit.source.proposed === 'excluded') fail(`${label}: cites [[${id}]] from excluded source ${hit.source.id}`)
  }
  // markers must sit right after the sentence they support
  for (const m of a.body.matchAll(/\[\[[^\]]+\]\]/g)) {
    const before = a.body.slice(0, m.index).replace(/(\s*\[\[[^\]]+\]\])+\s*$/, '').trimEnd()
    if (!/[.?!)"”:]$/.test(before)) fail(`${label}: citation ${m[0]} is not placed right after a sentence`)
  }
  if (/kJ\/mol|\\\(|\\frac|\$/.test(a.body)) fail(`${label}: uses kJ/mol or LaTeX`)
  if (/\n{3,}/.test(a.body)) fail(`${label}: has more than one blank line between paragraphs`)
  const n = words(a.body)
  if (a.outcome === 'answered') {
    if (distinct.size < 1 || distinct.size > 3) fail(`${label}: answered body cites ${distinct.size} distinct passages (want 1–3)`)
    if (n < 70 || n > 200) fail(`${label}: answered body is ${n} words (want 70–200)`)
  } else {
    if (n < 50 || n > 120) fail(`${label}: ${a.outcome} body is ${n} words (want 50–120)`)
    if (distinct.size < 1 || distinct.size > 3) fail(`${label}: cites ${distinct.size} distinct passages (want 1–3)`)
  }
  if (a.outcome === 'declined_pset') {
    if (useOfAi && !distinct.has(useOfAi)) fail(`${label}: decline does not cite the Use of AI passage`)
    if (![...distinct].some((id) => passageById.get(id)?.source.kind === 'lecture'))
      fail(`${label}: decline does not point to a lecture passage`)
    if (!/\d{1,2}:\d{2}/.test(a.body)) fail(`${label}: decline does not give a lecture timestamp`)
    for (const d of ps5Decimals) if (a.body.includes(d)) fail(`${label}: decline mentions PS5-specific number ${d}`)
  }
  if (a.outcome === 'sent_to_tfs' && ![...distinct].some((id) => id.startsWith('SYL-')))
    fail(`${label}: routing answer does not cite the syllabus`)
  checkTimestamps(label, a.body)
}

/** Every "m:ss … in Lecture N" pointer must land on a real passage of that lecture. */
function checkTimestamps(label: string, body: string) {
  const plain = body.replace(/\[\[[^\]]+\]\]/g, ' ')
  for (const sentence of plain.split(/(?<=[.;?!])\s+/)) {
    const tokens = [...sentence.matchAll(/(\d{1,2}:\d{2})|Lecture (\d+)/g)].map((m) =>
      m[1] ? { kind: 'time' as const, value: m[1], at: m.index! } : { kind: 'lecture' as const, value: m[2], at: m.index! },
    )
    tokens.forEach((tok, i) => {
      if (tok.kind !== 'time') return
      if (/\b(am|pm)\b/.test(sentence.slice(tok.at, tok.at + 14))) return // clock times like "2:00–3:30 pm"
      const next = tokens.slice(i + 1).find((t) => t.kind === 'lecture')
      const prev = tokens.slice(0, i).reverse().find((t) => t.kind === 'lecture')
      const lec = (next ?? prev)?.value
      if (!lec) return fail(`${label}: timestamp ${tok.value} does not name a lecture`)
      const src = course.sources.find((s) => s.id === `L${lec}`)
      if (!src?.passages.some((p) => p.loc === tok.value)) fail(`${label}: ${tok.value} is not a passage start in Lecture ${lec}`)
    })
  }
}

const topicSet = new Set(course.topics)
if (course.topics.length < 10 || course.topics.length > 12) fail(`Expected 10–12 topics, found ${course.topics.length}`)

course.testQuestions.forEach((q) => {
  if (!topicSet.has(q.topic)) fail(`${q.id}: topic "${q.topic}" is not in course.topics`)
  checkAnswer(q.id, q.answer)
})
course.sampleLog.forEach((e) => {
  if (!topicSet.has(e.topic)) fail(`${e.id}: topic "${e.topic}" is not in course.topics`)
  checkAnswer(e.id, e.answer)
})

// ---------- test questions ----------
const tqCount = (o: Outcome) => course.testQuestions.filter((q) => q.answer.outcome === o).length
if (course.testQuestions.length !== 20) fail(`Expected 20 test questions, found ${course.testQuestions.length}`)
if (tqCount('declined_pset') !== 4) fail(`Expected 4 declined_pset test questions, found ${tqCount('declined_pset')}`)
if (tqCount('not_covered') !== 1) fail(`Expected 1 not_covered test question, found ${tqCount('not_covered')}`)
const logistics = course.testQuestions.filter((q) => q.topic === 'Course logistics').length
if (logistics !== 2) fail(`Expected 2 regrade/extension test questions, found ${logistics}`)
for (const q of course.testQuestions) if (!/^Ed #\d+ · /.test(q.from)) fail(`${q.id}: "from" should look like "Ed #312 · PS4"`)

// ---------- sample log ----------
const windowStart = Date.parse('2026-09-28T00:00:00-04:00')
const windowEnd = Date.parse('2026-10-03T12:00:00-04:00')
const ps4Due = Date.parse('2026-10-02T23:59:00-04:00')
const ps5Out = Date.parse('2026-10-02T11:20:00-04:00')
if (course.sampleLog.length !== 64) fail(`Expected 64 log entries, found ${course.sampleLog.length}`)
let prev = -Infinity
for (const e of course.sampleLog) {
  if (!/-04:00$/.test(e.at)) fail(`${e.id}: timestamp ${e.at} lacks the -04:00 offset`)
  const t = Date.parse(e.at)
  if (Number.isNaN(t)) fail(`${e.id}: bad timestamp ${e.at}`)
  if (t < windowStart || t > windowEnd) fail(`${e.id}: ${e.at} is outside the Mon 00:00 – Sat 12:00 window`)
  if (t < prev) fail(`${e.id}: log is not in time order`)
  prev = t
  if (!/^Student \d{4}$/.test(e.student)) fail(`${e.id}: student handle "${e.student}"`)
  if (e.answer.outcome === 'declined_pset') {
    const ps = /ps\s?(\d)/i.exec(e.text)?.[1]
    if (ps === '4' && t > ps4Due) fail(`${e.id}: declines PS4 after its deadline`)
    if (ps === '5' && t < ps5Out) fail(`${e.id}: declines PS5 before it was released`)
    if (ps !== '4' && ps !== '5') fail(`${e.id}: declined question does not name PS4 or PS5`)
  }
}
const students = new Set(course.sampleLog.map((e) => e.student))
if (students.size < 35 || students.size > 45) fail(`Expected ~40 distinct students, found ${students.size}`)

const pressureCluster = course.sampleLog.filter(
  (e) => e.topic === 'Le Châtelier' && /argon|helium|inert|volume|pressure|compress|syringe|plunger/i.test(e.text),
)
if (pressureCluster.length < 9) fail(`Expected ≥9 Le Châtelier pressure/volume/inert-gas questions, found ${pressureCluster.length}`)

const targets: Record<Outcome, number> = { answered: 70, declined_pset: 15, sent_to_tfs: 8, not_covered: 7 }
const mix: string[] = []
for (const [o, target] of Object.entries(targets) as [Outcome, number][]) {
  const pct = (100 * course.sampleLog.filter((e) => e.answer.outcome === o).length) / course.sampleLog.length
  mix.push(`${o} ${pct.toFixed(1)}%`)
  if (Math.abs(pct - target) > 5) fail(`Log outcome ${o} is ${pct.toFixed(1)}% (target ${target}% ± 5)`)
}

// spike before PS4 deadline: Thu 8 pm – Fri 2 am
const spike = course.sampleLog.filter((e) => {
  const t = Date.parse(e.at)
  return t >= Date.parse('2026-10-01T20:00:00-04:00') && t <= Date.parse('2026-10-02T02:00:00-04:00')
}).length
if (spike < 12) warn(`Only ${spike} questions in the Thu 8 pm – Fri 2 am spike`)

// ---------- notation ----------
if (course.notation.length < 6 || course.notation.length > 8) fail(`Expected 6–8 notation pairs, found ${course.notation.length}`)

// ---------- report ----------
const passageCount = course.sources.reduce((n, s) => n + s.passages.length, 0)
console.log(
  `Sources ${course.sources.length} · passages ${passageCount} · test questions ${course.testQuestions.length} · ` +
    `log ${course.sampleLog.length} (${students.size} students, ${pressureCluster.length} pressure/volume/inert-gas, ${spike} in Thu-night spike)`,
)
console.log(`Log mix: ${mix.join(' · ')}`)
for (const w of warnings) console.log(`warning: ${w}`)
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`)
  console.error(`\n${errors.length} problem(s).`)
  process.exit(1)
}
console.log('✓ Content valid.')
