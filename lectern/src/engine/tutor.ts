import type { Answer, Course, Outcome, Passage, Source } from '../data/types'
import { Index, type Hit } from './search'
import { asksExamContent, isLogistics, matchPset } from './guard'
import { fold, overlap, tokens } from './text'
import { ruleOn } from './rules'
import { disableSample, getSample, PERMANENT, type SampleError } from './claude'

export type Method = 'prepared' | 'corrected' | 'claude' | 'quoted' | 'guard'

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
  const sentences = text.match(/[^.!?]+[.!?]+["”’)]*\s*/g) ?? [text]
  if (sentences.length <= max) return text.trim()
  const scored = sentences.map((s, i) => ({ s: s.trim(), i, v: overlap(s, query) }))
  const top = [...scored].sort((a, b) => b.v - a.v)[0]
  const start = Math.max(0, Math.min(top.i, sentences.length - max))
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
    const s = questionKey(q.text) === key ? 1 : overlap(q.text, question)
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
  const ai = syllabusPassage(ctx, /ai|artificial/i) ?? syllabusPassage(ctx, /collab/i)
  const hits = index.search(seed || question, 6)
  const lecture = hits.find((h) => h.source.kind === 'lecture') ?? hits[0]
  const prof = ctx.course.professor.short
  const parts = [
    `I can’t work through ${which} or check an answer for it. ${prof} asks that problem sets be your own work.${ai ? ` [[${ai.id}]]` : ''}`,
  ]
  if (lecture) {
    const quote = bestSentences(lecture.passage.text, seed || question, 1)
    parts.push(
      `Here’s where the idea you need is taught: **${sourceShort(lecture.source)} at ${lecture.passage.loc}**. “${quote}” [[${lecture.passage.id}]]`,
    )
  }
  parts.push(`If you’re still stuck after rewatching that, bring your attempt to office hours (${ctx.course.officeHours}).`)
  return { answer: { outcome: 'declined_pset', body: parts.join('\n\n') }, method: 'guard', read: hits }
}

function routeToTfs(ctx: TutorContext): TutorResult {
  const late = syllabusPassage(ctx, /late|extension/i)
  const regrade = syllabusPassage(ctx, /regrade/i)
  const lines = [`Grades, regrades and extensions are handled by the course staff, not by me.`]
  if (regrade) lines.push(`On regrades: “${bestSentences(regrade.text, 'regrade request', 2)}” [[${regrade.id}]]`)
  if (late) lines.push(`On extensions: “${bestSentences(late.text, 'extension request', 2)}” [[${late.id}]]`)
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

function notCovered(ctx: TutorContext, hits: Hit[]): TutorResult {
  return {
    answer: {
      outcome: 'not_covered',
      body: `I couldn’t find this in the materials ${ctx.course.professor.short} has approved, so I won’t guess.\n\nPost it on Ed, where ${ctx.course.professor.short} and the TFs answer, or bring it to office hours (${ctx.course.officeHours}).`,
    },
    method: 'guard',
    read: hits,
  }
}

const splitSentences = (text: string) => (text.match(/[^.!?]+[.!?]+["”’)]*\s*/g) ?? [text]).map((s) => s.trim()).filter(Boolean)

/** The best run of sentences across the top passages, weighting the question's rarer words. */
export function bestQuote(hits: Hit[], query: string, len = 2) {
  const q = [...new Set(tokens(query))]
  const pool = hits.slice(0, 4)
  const sents = pool.map((h) => splitSentences(h.passage.text))
  const df = new Map<string, number>()
  const all = sents.flat()
  for (const s of all) for (const t of new Set(tokens(s))) df.set(t, (df.get(t) ?? 0) + 1)
  const w = (t: string) => Math.log(1 + all.length / (1 + (df.get(t) ?? 0)))
  const top = pool[0]?.score ?? 1
  let best = { hit: pool[0], text: pool[0]?.passage.text ?? '', v: -1 }
  pool.forEach((h, hi) => {
    const ss = sents[hi]
    for (let i = 0; i < ss.length; i++) {
      const win = ss.slice(i, i + len)
      const toks = new Set(tokens(win.join(' ')))
      const v = q.reduce((sum, t) => sum + (toks.has(t) ? w(t) : 0), 0) * (0.55 + 0.45 * (h.score / top))
      if (v > best.v) best = { hit: h, text: win.join(' '), v }
    }
  })
  return best
}

function quoted(question: string, hits: Hit[]): TutorResult {
  const main = bestQuote(hits, question, 3)
  const rest = hits.filter((h) => h.source.id !== main.hit.source.id && h.passage.id !== main.hit.passage.id)
  const second = rest.length ? bestQuote(rest, question, 1) : null
  const lines = [
    `Here’s how this is explained in **${sourceShort(main.hit.source)} at ${main.hit.passage.loc}**:`,
    `> ${main.text} [[${main.hit.passage.id}]]`,
  ]
  if (second && second.v > main.v * 0.35) {
    lines.push(`It also comes up in **${citeLabel(second.hit.source, second.hit.passage)}**: “${second.text}” [[${second.hit.passage.id}]]`)
  }
  return { answer: { outcome: 'answered', body: lines.join('\n\n') }, method: 'quoted', read: hits }
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

  // 2. Guards that never reach a model.
  const pset = matchPset(question, recognize)
  if (pset) {
    const which = pset.passage ? `${sourceShort(pset.source)} ${pset.passage.loc.toLowerCase()}` : `that ${sourceShort(pset.source)} problem`
    const r = declinePset(question, ctx, index, which.replace(/^problem set (\d+)/i, 'PS$1'), pset.passage?.text ?? '')
    opts.onRead?.(r.read)
    return r
  }
  if (ruleOn(ctx.rules, 'tfs') && isLogistics(question)) return routeToTfs(ctx)
  if (ruleOn(ctx.rules, 'exam') && asksExamContent(question)) return examContent(ctx)

  // 3. Read the approved materials.
  const historyText = (opts.history ?? []).filter((t) => t.role === 'user').slice(-1).map((t) => t.content).join(' ')
  let hits = index.search(question, 6)
  if (hits.length < 3 && historyText) hits = index.search(`${question} ${historyText}`, 6)
  opts.onRead?.(hits)
  const strong = hits.length > 0 && hits[0].score >= 2.2 && tokens(question).length > 0
  if (!strong) return notCovered(ctx, hits)

  // 4. Claude writes from those passages when this viewer can use it; otherwise quote them.
  const sample = await getSample()
  if (!sample) return quoted(question, hits)
  const allowed = new Set(hits.map((h) => h.passage.id))
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
    return quoted(question, hits)
  }
}

export const outcomeLabel: Record<Outcome, string> = {
  answered: 'Answered',
  declined_pset: 'Declined · problem set',
  sent_to_tfs: 'Sent to TFs',
  not_covered: 'Not in your materials',
}

export const isQuestionLike = (q: string) => fold(q).replace(/[^a-z0-9]/g, '').length >= 3
