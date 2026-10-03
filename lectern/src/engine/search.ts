import type { Passage, Source } from '../data/types'
import { expand, tokens } from './text'

export interface Hit {
  passage: Passage
  source: Source
  score: number
}

interface Doc {
  passage: Passage
  source: Source
  tf: Map<string, number>
  len: number
}

// Lectures and the professor's own Ed answers are the voice we want first;
// slides are terse and work best as supporting citations.
const KIND_WEIGHT: Record<string, number> = {
  lecture: 1.1,
  ed: 1.15,
  syllabus: 1,
  slides: 0.85,
  pset: 1,
  exam: 0.9,
  upload: 1.05,
}

/** BM25 over passages, with field text from the source title mixed in lightly. */
export class Index {
  private docs: Doc[] = []
  private df = new Map<string, number>()
  private avg = 1

  constructor(sources: Source[]) {
    for (const source of sources) {
      const titleToks = tokens(source.title)
      for (const passage of source.passages) {
        const toks = [...tokens(passage.text), ...titleToks]
        const tf = new Map<string, number>()
        for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1)
        for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1)
        this.docs.push({ passage, source, tf, len: toks.length })
      }
    }
    this.avg = this.docs.reduce((s, d) => s + d.len, 0) / Math.max(1, this.docs.length)
  }

  get size() {
    return this.docs.length
  }

  search(query: string, k = 6): Hit[] {
    const q = expand(tokens(query))
    if (!q.length) return []
    const N = this.docs.length
    const k1 = 1.2
    const b = 0.75
    const hits: Hit[] = []
    for (const d of this.docs) {
      let s = 0
      let matched = 0
      for (const { t, w } of q) {
        const f = d.tf.get(t)
        if (!f) continue
        const df = this.df.get(t) ?? 0
        const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5))
        s += w * idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / this.avg)))
        if (w === 1) matched++
      }
      if (s <= 0) continue
      // Reward passages that cover more of the question, not one repeated word.
      const coverage = matched / Math.max(1, q.filter((x) => x.w === 1).length)
      s *= (0.6 + 0.8 * coverage) * (KIND_WEIGHT[d.source.kind] ?? 1)
      hits.push({ passage: d.passage, source: d.source, score: s })
    }
    hits.sort((a, b) => b.score - a.score)
    // Keep at most two passages from one source so citations spread across materials.
    const per = new Map<string, number>()
    const out: Hit[] = []
    for (const h of hits) {
      const n = per.get(h.source.id) ?? 0
      if (n >= 2) continue
      per.set(h.source.id, n + 1)
      out.push(h)
      if (out.length >= k) break
    }
    return out
  }
}
