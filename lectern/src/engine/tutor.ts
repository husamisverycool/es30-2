import type { Answer, Course, Outcome, Passage, Source } from '../data/types'
import { Index, type Hit } from './search'
import { asksExamContent, isLogistics, matchPset } from './guard'
import { expand, fold, matchScore, overlap, sentences, tokens } from './text'
import { ruleOn } from './rules'
import { disableSample, getSample, PERMANENT, type SampleError } from './claude'
import { getApiKey, streamAnswer, type ApiError } from './anthropic'

export type Method = 'prepared' | 'corrected' | 'claude' | 'quoted' | 'guard'

/** The last API failure, so Settings can say why answers fell back to quotes. */
export let lastApiError = ''

export interface TutorResult {
  answer: Answer
  method: Method
  /** Passages the tutor read before answering, best first. */
  read: Hit[]
  /** Set when Claude stopped part-way; the text shown is what arrived. */
  interrupted?: boolean
}

export interface Correction {
  question: string
  body: string
  at: string
}

export interface TutorContext {
  course: Course
  /** Every source, including ones the professor added. */
  sources: Source[]
  approved: (id: string) => boolean
  rules: Record<string, boolean>
  customRules: string[]
  corrections: Correction[]
}

export interface AskOptions {
  history?: { role: 'user' | 'assistant'; content: string }[]
  onText?: (body: string) => void
  onRead?: (hits: Hit[]) => void
  signal?: AbortSignal
  /** Skip prepared answers (used when the professor asks for a fresh answer). */
  fresh?: boolean
}

export const questionKey = (q: string) => tokens(q).join(' ')

const byId = (sources: Source[]) => {
  const m = new Map<string, { passage: Passage; source: Source }>()
  for (const source of sources) for (const passage of source.passages) m.set(passage.id, { passage, source })
  return m
}

export const citedIds = (body: string) => [...body.matchAll(/\[\[([A-Za-z0-9_.:-]+)\]\]/g)].map((m) => m[1])

/** The sentence in a passage that best answers the question, for short quotes. */
export function bestSentences(text: string, query: string, max = 2): string {
  const ss = sentences(text)
  if (ss.length <= max) return text.trim()
  const scored = ss.map((s, i) => ({ s, i, v: overlap(s, query) }))
  const top = [...scored].sort((a, b) => b.v - a.v)[0]
  const start = Math.max(0, Math.min(top.i, ss.length - max))
  return scored
    .slice(start, start + max)
    .map((x) => x.s)
    .join(' ')
}

export function sourceShort(s: Source): string {
  if (s.kind === 'lecture') return s.title.split('·')[0].trim()
  if (s.kind === 'slides') return s.title.replace('Slides · ', 'Slides, ')
  return s.title.split('·')[0].trim()
}

export function citeLabel(source: Source, passage: Passage): string {
  return `${sourceShort(source)} · ${passage.loc}`
}

function syllabusPassage(ctx: TutorContext, pattern: RegExp): Passage | undefined {
  const syl = ctx.sources.find((s) => s.kind === 'syllabus' && ctx.approved(s.id))
  return syl?.passages.find((p) => pattern.test(p.loc))
}

function prepared(question: string, ctx: TutorContext): { answer: Answer; method: Method } | null {
  const key = questionKey(question)
  const corr = ctx.corrections.find((c) => questionKey(c.question) === key || overlap(c.question, question) > 0.86)
  if (corr) return { answer: { outcome: 'answered', body: corr.body }, method: 'corrected' }

  const pool = [...ctx.course.testQuestions, ...ctx.course.sampleLog]
  let best: { text: string; answer: Answer } | null = null
  let bestScore = 0
  for (const q of pool) {
    const s = questionKey(q.text) === key ? 1 : matchScore(q.text, question)
    if (s > bestScore) {
      bestScore = s
      best = q
    }
  }
  if (!best || bestScore < 0.8) return null
  // A prepared answer is only valid while every source it cites is still approved.
  const map = byId(ctx.sources)
  const ok = citedIds(best.answer.body).every((id) => {
    const hit = map.get(id)
    return hit && ctx.approved(hit.source.id) && hit.source.mode === 'answer'
  })
  return ok ? { answer: best.answer, method: 'prepared' } : null
}

function declinePset(question: string, ctx: TutorContext, index: Index, which: string, seed: string): TutorResult {
  const ai = syllabusPassage(ctx, /\bAI\b|artificial/) ?? syllabusPassage(ctx, /collab/i)
  const query = seed ? `${seed} ${question}` : question
  const hits = index.search(query, 8)
  const lectures = hits.filter((h) => h.source.kind === 'lecture')
  const prof = ctx.course.professor.short
  const parts = [
    `I can’t work through ${which} or check an answer for it. ${prof} asks that problem sets be your own work.${ai ? ` [[${ai.id}]]` : ''}`,
  ]
  if (lectures.length) {
    const q = bestQuote(lectures, query, index, ctx.sources, 2)
    parts.push(
      `Here’s where the idea you need is taught: **${sourceShort(q.hit.source)} at ${q.hit.passage.loc}**. “${q.text}” ${q.ids.map((id) => `[[${id}]]`).join(' ')}`,
    )
  }
  parts.push(`If you’re still stuck after rewatching that, bring your attempt to office hours (${ctx.course.officeHours}).`)
  return { answer: { outcome: 'declined_pset', body: parts.join('\n\n') }, method: 'guard', read: hits }
}

// What the student is asking about, and the words that mark the syllabus sentence that answers it.
const STAFF_INTENTS: [RegExp, RegExp, RegExp][] = [
  [/\bsections?\b/, /section/i, /staff/i],
  [/conflict|different time|make-?up|reschedul|away game|miss(ed)? the (midterm|exam)/, /conflict/i, /exam/i],
  [/extension|extend|late/, /extension/i, /late/i],
  [/regrade|graded|points back|score|wrong/, /regrade/i, /regrade/i],
  [/gradescope|upload|missing/, /gradescope/i, /problem sets/i],
  [/accommodat|disabilit/, /accommodation/i, /accommodation/i],
  [/sick|ill\b|emergency|dean/, /illness|emergency|resident dean/i, /late|accommodation/i],
]

function routeToTfs(ctx: TutorContext, question: string, index: Index): TutorResult {
  const f = fold(question)
  const syl = ctx.sources.find((s) => s.kind === 'syllabus' && ctx.approved(s.id))
  const quotes: { loc: string; id: string; text: string }[] = []
  for (const [ask, mark, prefer] of STAFF_INTENTS) {
    if (!syl || !ask.test(f) || quotes.length >= 1) continue
    // The section named for the topic first ("Late work" for extensions), then any section that mentions it.
    const ordered = [...syl.passages.filter((p) => prefer.test(p.loc)), ...syl.passages.filter((p) => !prefer.test(p.loc))]
    for (const p of ordered) {
      if (/\bAI\b|collab|schedule/i.test(p.loc)) continue
      const ss = sentences(p.text)
      const i = ss.findIndex((s) => mark.test(s))
      if (i < 0) continue
      quotes.push({ loc: p.loc, id: p.id, text: ss.slice(i, i + 2).join(' ') })
      break
    }
  }
  // Then who to contact, from the staff section.
  const staff = syl?.passages.find((p) => /staff/i.test(p.loc))
  const contact = staff && sentences(staff.text).find((s) => /head (teaching fellow|TF)/i.test(s))
  if (staff && contact && !quotes.some((q) => q.text.includes(contact))) quotes.push({ loc: staff.loc, id: staff.id, text: contact })
  // Nothing matched a known intent: fall back to the closest syllabus section.
  if (!quotes.length) {
    const h = index.search(question, 20).find((x) => x.source.kind === 'syllabus' && !/\bAI\b|collab|schedule/i.test(x.passage.loc))
    if (h) quotes.push({ loc: h.passage.loc, id: h.passage.id, text: bestQuote([h], question, index, ctx.sources, 2).text })
  }
  const lines = [`That’s one for the course staff, not for me: grades, extensions, exam conflicts and sections are theirs to decide.`]
  for (const q of quotes) lines.push(`From the syllabus, under ${q.loc}: “${q.text}” [[${q.id}]]`)
  lines.push(`For anything the syllabus doesn’t cover, post privately on Ed so a TF can look at your case.`)
  return { answer: { outcome: 'sent_to_tfs', body: lines.join('\n\n') }, method: 'guard', read: [] }
}

function examContent(ctx: TutorContext): TutorResult {
  const exams = syllabusPassage(ctx, /exam/i)
  const practice = ctx.sources.find((s) => s.kind === 'exam' && ctx.approved(s.id))
  const lines = [`I can’t say what will be on an upcoming exam.`]
  if (exams) lines.push(`Here’s what the syllabus says: “${bestSentences(exams.text, 'midterm covers', 2)}” [[${exams.id}]]`)
  if (practice) lines.push(`${ctx.course.professor.short} posted **${practice.title}** for practice, and I can walk you through any of it.`)
  return { answer: { outcome: 'answered', body: lines.join('\n\n') }, method: 'guard', read: [] }
}

function notCovered(ctx: TutorContext, hits: Hit[], ahead?: Upcoming | null): TutorResult {
  const prof = ctx.course.professor.short
  const first = ahead
    ? `${prof} hasn’t taught this yet. ${ahead.when.startsWith('Lecture') ? `The syllabus has it in ${ahead.when}: ${ahead.topic}.` : `The syllabus schedules ${ahead.topic} for ${ahead.when}.`} [[${ahead.passage.id}]] Until then I’d only be guessing, and I won’t.`
    : `I couldn’t find this in the materials ${prof} has approved, so I won’t guess.`
  return {
    answer: {
      outcome: 'not_covered',
      body: `${first}\n\nPost it on Ed, where ${prof} and the TFs answer, or bring it to office hours (${ctx.course.officeHours}).`,
    },
    method: 'guard',
    read: hits,
  }
}

// Housekeeping sentences: deadlines, reading and slide pointers, greetings, wrap-ups.
const META =
  /\b(problem set \d+ (is|was) (due|posted)|is due (friday|monday|tonight|tomorrow|today)|good (morning|afternoon)|brown,? chapter|chapter \d+,? section|today:|last time|next time|see you|that's (it|all) for today|any questions)\b/i
const isMeta = (sentence: string) => META.test(sentence) || (sentence.length < 70 && /\bslide \d+\.?$/i.test(sentence))

// Slides read as fragments and the syllabus as policy, so prefer spoken explanations for the main quote.
const QUOTE_KIND: Record<string, number> = { slides: 0.75, syllabus: 0.85 }

export interface Quote {
  hit: Hit
  text: string
  /** Passage ids the quote spans: one, or two when it runs on into the next part of a transcript. */
  ids: string[]
  v: number
}

/** The best run of sentences across the top passages, weighting the question's rarer words. */
export function bestQuote(hits: Hit[], query: string, index: Index, sources: Source[], len = 2): Quote {
  const raw = tokens(query)
  const q = expand(raw)
  const pairs = raw.slice(1).map((t, i) => `${raw[i]} ${t}`)
  const pool = hits.slice(0, 4)
  const top = pool[0]?.score ?? 1
  let best: Quote = { hit: pool[0], text: pool[0]?.passage.text ?? '', ids: pool[0] ? [pool[0].passage.id] : [], v: -1 }
  for (const h of pool) {
    const own = sentences(h.passage.text).map((s) => ({ s, id: h.passage.id }))
    // A transcript runs on: let a quote continue into the next passage, so it doesn't stop just before the answer.
    const src = sources.find((x) => x.id === h.source.id)
    const idx = src?.passages.findIndex((p) => p.id === h.passage.id) ?? -1
    const next = src && src.kind === 'lecture' && idx >= 0 ? src.passages[idx + 1] : undefined
    const ss = next ? [...own, ...sentences(next.text).slice(0, len).map((s) => ({ s, id: next.id }))] : own
    for (let i = 0; i < own.length; i++) {
      // Score the window as spoken, but show it starting on the explanation, not on housekeeping
      // ("Hess's law, slide 9." or "Problem Set 4 is due Friday"), and read on past a rhetorical question.
      const scored = ss.slice(i, i + len)
      let start = i
      while (start < ss.length - 1 && start < i + len - 1 && isMeta(ss[start].s)) start++
      let win = ss.slice(start, start + len)
      while (win.length > 1 && isMeta(win[win.length - 1].s)) win = win.slice(0, -1)
      for (let j = start + win.length; j < ss.length && win.length < len + 2 && /\?["”’)]?$/.test(win[win.length - 1].s); j++) win = [...win, ss[j]]
      const text = scored.map((x) => x.s).join(' ')
      const wt = tokens(text)
      const set = new Set(wt)
      const bi = new Set(wt.slice(1).map((t, j) => `${wt[j]} ${t}`))
      let v = q.reduce((sum, { t, w }) => sum + (set.has(t) ? w * Math.max(0.2, index.idf(t)) : 0), 0)
      v *= 1 + 0.3 * pairs.filter((p) => bi.has(p)).length
      v *= Math.pow(h.score / top, 1.5) * (QUOTE_KIND[h.source.kind] ?? 1)
      // A policy section states its rule first.
      if (h.source.kind === 'syllabus' && i === 0) v *= 1.2
      // A lecture's opening and closing passages are mostly logistics and previews.
      if (src?.kind === 'lecture' && (idx === 0 || idx === src.passages.length - 1)) v *= 0.8
      // Between equal windows, prefer the tighter one.
      v /= 1 + wt.length / 400
      if (v > best.v) best = { hit: h, text: win.map((x) => x.s).join(' '), ids: [...new Set(win.map((x) => x.id))], v }
    }
  }
  return best
}

/** How a quoted answer introduces its source, in words a student reads naturally. */
function leadIn(h: Hit, who: string): string {
  const src = h.source
  if (src.kind === 'lecture') return `${who} explains this in **${sourceShort(src)}, at ${h.passage.loc}**:`
  if (src.kind === 'ed') return `${who} answered this on Ed (**post ${h.passage.loc.replace(/^Ed\s*/, '')}**):`
  if (src.kind === 'syllabus') return `The syllabus covers this under **${h.passage.loc}**:`
  if (src.kind === 'slides') return `It’s on **${sourceShort(src)}, ${h.passage.loc.toLowerCase()}**:`
  if (src.kind === 'exam') return `It comes up in **${sourceShort(src)}, ${h.passage.loc}**:`
  return `From **${citeLabel(src, h.passage)}**:`
}

function alsoIn(h: Hit, who: string): string {
  const src = h.source
  if (src.kind === 'lecture') return `${who} comes back to it in **${sourceShort(src)}, at ${h.passage.loc}**`
  if (src.kind === 'ed') return `${who} also answered it on Ed (**post ${h.passage.loc.replace(/^Ed\s*/, '')}**)`
  if (src.kind === 'syllabus') return `The syllabus adds, under **${h.passage.loc}**`
  return `It’s also in **${citeLabel(src, h.passage)}**`
}

// Deadlines, dates and places are syllabus facts: quote the syllabus first when it has the answer.
const COURSE_FACT =
  /\b(due|deadline|office hours?|late (work|policy|penalty|submissions?)|what time|where (is|are) (the )?(lecture|section|office|exam|midterm|final)|when (is|are) (the )?(midterm|final|exam|quiz|section|office hours|problem sets?|psets?|homework|lecture))\b/

function quoted(question: string, all: Hit[], index: Index, ctx: TutorContext): TutorResult {
  const hits = all.filter((h) => !(h.source.kind === 'syllabus' && /\bAI\b|collab/i.test(h.passage.loc))).concat()
  if (!hits.length) hits.push(...all)
  let syllabusHits: Hit[] = []
  if (COURSE_FACT.test(fold(question))) {
    const isSyl = (h: Hit) => h.source.kind === 'syllabus' && !/\bAI\b|collab/i.test(h.passage.loc)
    syllabusHits = hits.filter(isSyl)
    // Lectures mention deadlines in passing; look further down for the syllabus section that states them.
    if (!syllabusHits.length) syllabusHits = index.search(question, 30).filter(isSyl)
  }
  const main = syllabusHits.length ? bestQuote(syllabusHits, question, index, ctx.sources, 2) : bestQuote(hits, question, index, ctx.sources, 3)
  // Course policy passages are for policy questions, not a second quote on chemistry.
  const policy = (h: Hit) => h.source.kind === 'syllabus' && /\bAI\b|collab/i.test(h.passage.loc)
  const rest = hits.filter((h) => h.source.id !== main.hit.source.id && !policy(h))
  const second = rest.length ? bestQuote(rest, question, index, ctx.sources, 2) : null
  const who = ctx.course.professor.short
  const lines = [leadIn(main.hit, who), `> ${main.text} ${main.ids.map((id) => `[[${id}]]`).join(' ')}`]
  if (second && second.v > main.v * 0.4) {
    lines.push(`${alsoIn(second.hit, who)}: “${second.text}” ${second.ids.map((id) => `[[${id}]]`).join(' ')}`)
  }
  lines.push(`Tap a number to open the ${main.hit.source.kind === 'lecture' ? 'transcript at that moment' : 'source'}. If this doesn’t answer it, ask it a different way or post on Ed.`)
  const read = all.some((h) => h.passage.id === main.hit.passage.id) ? all : [main.hit, ...all]
  return { answer: { outcome: 'answered', body: lines.join('\n\n') }, method: 'quoted', read }
}

interface Upcoming {
  when: string
  topic: string
  passage: Passage
}

/** Topics the syllabus schedule lists for lectures that haven't happened yet. */
function upcomingTopics(ctx: TutorContext): Upcoming[] {
  const syl = ctx.sources.find((s) => s.kind === 'syllabus' && ctx.approved(s.id))
  const sched = syl?.passages.find((p) => /schedule/i.test(p.loc))
  if (!sched) return []
  const taught = Math.max(
    0,
    ...ctx.sources.filter((s) => s.kind === 'lecture' && ctx.approved(s.id)).map((s) => Number(s.title.match(/lecture\s*(\d+)/i)?.[1] ?? 0)),
  )
  const out: Upcoming[] = []
  for (const m of sched.text.matchAll(/Lecture (\d+), ([A-Z][a-z]{2} [A-Z][a-z]{2} \d+): ([^.(]+)/g)) {
    if (Number(m[1]) > taught) out.push({ when: `Lecture ${m[1]} (${m[2]})`, topic: m[3].trim(), passage: sched })
  }
  const after = sched.text.match(/After the midterm: ([^.]+)/)
  if (after)
    for (const t of after[1].split(/,\s*|\s+and\s+/)) {
      const topic = t.replace(/^(then|and)\s+/, '').trim()
      if (topic) out.push({ when: 'after Midterm 1', topic, passage: sched })
    }
  return out
}

/** Does the question ask about something the course hasn't reached? Matches on words rare in the materials taught so far. */
function aheadOfCourse(question: string, ctx: TutorContext, index: Index, hits: Hit[]): Upcoming | null {
  const raw = tokens(question)
  const q = new Set(expand(raw).map((x) => x.t))
  const qPairs = new Set(raw.slice(1).map((t, i) => `${raw[i]} ${t}`))
  const upcoming = upcomingTopics(ctx)
  if (!upcoming.length) return null
  // The schedule itself mentions every upcoming topic; it doesn't count as having taught it.
  const top = hits.find((h) => h.passage.id !== upcoming[0].passage.id)?.score ?? 0
  for (const u of upcoming) {
    const tt = tokens(u.topic)
    // A rare phrase ("weak base") is a strong signal even when nearby material scores well.
    const pairs = tt.slice(1).map((t, i) => `${tt[i]} ${t}`)
    if (pairs.some((p) => qPairs.has(p) && index.bigramDf(p) <= 2)) return u
    const words = tt.filter((t) => t.length > 2 && index.df_(t) <= 3)
    if (words.some((t) => q.has(t)) && top < 14) return u
  }
  return null
}

function buildPrompt(question: string, hits: Hit[], ctx: TutorContext, history: AskOptions['history']) {
  const c = ctx.course
  const prof = c.professor.short
  const open = ctx.sources.filter((s) => s.mode === 'recognize' && ctx.approved(s.id)).map((s) => s.title)
  const rules = [
    `Never work, finish, or check problems from the current problem set${open.length ? ` (${open.join(', ')})` : ''}. If asked, give one conceptual nudge, point to the lecture, and give no numbers specific to the problem.`,
    `Answer only from the materials below. If they do not cover the question, say so plainly and suggest posting on Ed or going to office hours (${c.officeHours}). Never fill gaps from general knowledge.`,
  ]
  if (ruleOn(ctx.rules, 'cite')) rules.push('After each sentence that relies on a passage, add its id in double square brackets, e.g. [[L11-04]]. Use only ids listed below. Prefer lecture passages so students can rewatch the explanation.')
  if (ruleOn(ctx.rules, 'notation') && c.notation.length) rules.push(`Use ${prof}'s notation: ${c.notation.map((n) => `write "${n.write}", not "${n.not}"`).join('; ')}.`)
  if (ruleOn(ctx.rules, 'tfs')) rules.push('Grades, regrades and extensions go to the TFs; quote the syllabus policy and promise nothing.')
  if (ruleOn(ctx.rules, 'exam')) rules.push('Do not speculate about what is on an upcoming exam.')
  for (const r of ctx.customRules) rules.push(r)

  const materials = hits
    .map((h) => `[${h.passage.id}] ${h.source.title} — ${h.passage.loc}\n${h.passage.text}`)
    .join('\n\n')
  const convo = (history ?? [])
    .slice(-4)
    .map((t) => `${t.role === 'user' ? 'Student' : 'Tutor'}: ${t.content.replace(/\[\[[^\]]+\]\]/g, '')}`)
    .join('\n')

  return `You are the course tutor for ${c.code} ${c.title} (${c.term}), taught by ${c.professor.name}. You help students using only the course materials below, which ${prof} approved. ${prof} can read every question asked here. Refer to ${prof} in the third person and never claim to be them.

Rules:
${rules.map((r) => `- ${r}`).join('\n')}

Style: under 170 words; plain sentences; paragraphs separated by a blank line; "- " bullets only for steps; **bold** at most twice; Unicode for chemistry (H₂O, ΔH°, ⇌, kJ mol⁻¹, 1.8 × 10⁻⁵); no LaTeX, no headings, no sign-off.

Begin your reply with exactly one line, one of:
OUTCOME: answered
OUTCOME: not_covered
OUTCOME: sent_to_tfs
OUTCOME: declined_pset
then a blank line, then the answer.

Materials:
${materials || '(none matched)'}
${convo ? `\nConversation so far:\n${convo}\n` : ''}
Student's question: ${question}`
}

function splitOutcome(text: string): { outcome: Outcome | null; body: string } {
  const m = text.match(/^\s*OUTCOME:\s*(answered|not_covered|sent_to_tfs|declined_pset)\s*\n?/i)
  if (!m) {
    // Still streaming the first line: hide it until it's complete.
    if (/^\s*O(U(T(C(O(M(E(:[a-z_ ]*)?)?)?)?)?)?)?$/i.test(text)) return { outcome: null, body: '' }
    return { outcome: null, body: text.trim() }
  }
  return { outcome: m[1].toLowerCase() as Outcome, body: text.slice(m[0].length).trim() }
}

/** Drop citation markers that point at passages the tutor was not given. */
function cleanCitations(body: string, allowed: Set<string>) {
  return body.replace(/\s?\[\[([^\]]+)\]\]/g, (m, id) => (allowed.has(id) ? m : ''))
}

export function buildIndex(ctx: TutorContext) {
  return new Index(ctx.sources.filter((s) => s.mode === 'answer' && ctx.approved(s.id)))
}

export async function ask(question: string, ctx: TutorContext, opts: AskOptions = {}): Promise<TutorResult> {
  const index = buildIndex(ctx)
  const recognize = ctx.sources.filter((s) => s.mode === 'recognize' && ctx.approved(s.id))

  // 1. The professor's own correction, or an answer prepared during setup and still backed by approved sources.
  if (!opts.fresh) {
    const p = prepared(question, ctx)
    if (p) {
      const map = byId(ctx.sources)
      const read = citedIds(p.answer.body)
        .map((id) => map.get(id))
        .filter((x): x is { passage: Passage; source: Source } => !!x)
        .map((x) => ({ ...x, score: 1 }))
      opts.onRead?.(read)
      return { answer: p.answer, method: p.method, read }
    }
  }

  // 2. Guards that never reach a model. Grades and extensions first: "can I get an extension on PS5" isn't PS5 work.
  if (ruleOn(ctx.rules, 'tfs') && isLogistics(question)) return routeToTfs(ctx, question, index)
  const pset = matchPset(question, recognize)
  if (pset) {
    const which = pset.passage ? `${sourceShort(pset.source)} ${pset.passage.loc.toLowerCase()}` : `that ${sourceShort(pset.source)} problem`
    const r = declinePset(question, ctx, index, which.replace(/^problem set (\d+)/i, 'PS$1'), pset.passage?.text ?? '')
    opts.onRead?.(r.read)
    return r
  }
  if (ruleOn(ctx.rules, 'exam') && asksExamContent(question)) return examContent(ctx)

  // 3. Read the approved materials.
  const historyText = (opts.history ?? []).filter((t) => t.role === 'user').slice(-1).map((t) => t.content).join(' ')
  let hits = index.search(question, 6)
  if (hits.length < 3 && historyText) hits = index.search(`${question} ${historyText}`, 6)
  opts.onRead?.(hits)
  const strong = hits.length > 0 && hits[0].score >= 2.2 && tokens(question).length > 0
  if (!strong) return notCovered(ctx, hits)
  const ahead = aheadOfCourse(question, ctx, index, hits)
  if (ahead) return notCovered(ctx, hits, ahead)

  // 4. Claude writes from those passages when this viewer can use it; otherwise quote them.
  const allowed = new Set(hits.map((h) => h.passage.id))
  const sample = await getSample()
  if (!sample) {
    // Outside the Claude viewer: use the founder's API key if one is set in Settings.
    if (!getApiKey()) return quoted(question, hits, index, ctx)
    let outcome: Outcome | null = null
    try {
      const text = await streamAnswer(buildPrompt(question, hits, ctx, opts.history), {
        signal: opts.signal,
        onText: (t) => {
          const s = splitOutcome(t)
          outcome = s.outcome ?? outcome
          if (s.body) opts.onText?.(cleanCitations(s.body, allowed))
        },
      })
      const s = splitOutcome(text)
      return { answer: { outcome: s.outcome ?? outcome ?? 'answered', body: cleanCitations(s.body, allowed) }, method: 'claude', read: hits }
    } catch (err) {
      const e = err as ApiError
      if (e.code === 'cancelled') throw { code: 'cancelled' }
      if (e.text) {
        const s = splitOutcome(e.text)
        if (s.body) return { answer: { outcome: s.outcome ?? 'answered', body: cleanCitations(s.body, allowed) }, method: 'claude', read: hits, interrupted: true }
      }
      lastApiError = e.message
      return quoted(question, hits, index, ctx)
    }
  }
  try {
    let outcome: Outcome | null = null
    const { text } = await sample(buildPrompt(question, hits, ctx, opts.history), {
      cache: false,
      signal: opts.signal,
      onText: ({ text }) => {
        const s = splitOutcome(text)
        outcome = s.outcome ?? outcome
        if (s.body) opts.onText?.(cleanCitations(s.body, allowed))
      },
    })
    const s = splitOutcome(text)
    return {
      answer: { outcome: s.outcome ?? outcome ?? 'answered', body: cleanCitations(s.body, allowed) },
      method: 'claude',
      read: hits,
    }
  } catch (err) {
    const e = err as SampleError
    if (e?.code === 'cancelled') throw err
    if (PERMANENT.has(e?.code)) disableSample()
    if (e?.text) {
      const s = splitOutcome(e.text)
      if (s.body) return { answer: { outcome: s.outcome ?? 'answered', body: cleanCitations(s.body, allowed) }, method: 'claude', read: hits, interrupted: true }
    }
    return quoted(question, hits, index, ctx)
  }
}

export const outcomeLabel: Record<Outcome, string> = {
  answered: 'Answered',
  declined_pset: 'Declined · problem set',
  sent_to_tfs: 'Sent to TFs',
  not_covered: 'Not in your materials',
}

export const isQuestionLike = (q: string) => fold(q).replace(/[^a-z0-9]/g, '').length >= 3
