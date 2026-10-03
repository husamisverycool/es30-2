// Text normalisation shared by search, the problem-set guard and question matching.

const SUB: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁺': '+', '⁻': '-', '₊': '+', '₋': '-',
}

const STOP = new Set(
  ('a an and are as at be been but by can could did do does doing for from had has have how i if in into is it its ' +
    'just me my of on or our so some such than that the their them then there these they this to too us was we were ' +
    'what when where which who why will with would you your im ive dont doesnt isnt cant pls please thanks thank ' +
    'someone anyone help confused get got also like really kind sort mean one way about lol ok okay hi hey still')
    .split(' '),
)

// Words students use for the same idea. Keys and values are post-normalisation tokens.
const SYNONYMS: Record<string, string[]> = {
  ice: ['table', 'change', 'initial', 'equilibrium'],
  chatelier: ['shift', 'stress', 'disturb'],
  shift: ['chatelier'],
  inert: ['argon', 'noble', 'unreactive'],
  argon: ['inert'],
  sigfig: ['significant', 'figure'],
  sigfigs: ['significant', 'figure'],
  significant: ['sigfig'],
  limiting: ['reagent', 'reactant', 'excess'],
  reactant: ['reagent'],
  reagent: ['reactant'],
  molarity: ['concentration', 'mol', 'liter'],
  concentration: ['molarity'],
  dilution: ['dilute', 'stock'],
  enthalpy: ['dh', 'heat'],
  hess: ['reverse', 'flip', 'sum'],
  calorimetry: ['calorimeter', 'heat', 'capacity'],
  ph: ['acid', 'h3o', 'hydronium'],
  ka: ['acid', 'dissociation'],
  kp: ['pressure', 'partial'],
  kc: ['concentration'],
  k: ['equilibrium', 'constant'],
  q: ['quotient', 'reaction'],
  solid: ['pure', 'liquid', 'omit'],
  liquid: ['pure', 'solid'],
  water: ['liquid', 'h2o'],
  pressure: ['volume', 'gas'],
  volume: ['pressure'],
  gas: ['ideal', 'pressure'],
  r: ['constant', 'gas'],
  regrade: ['gradescope', 'regrades'],
  extension: ['late', 'extensions'],
  late: ['extension'],
  midterm: ['exam'],
  exam: ['midterm'],
  approximation: ['small', 'x', '5'],
  small: ['approximation'],
}

export function fold(s: string): string {
  let out = ''
  for (const ch of s) out += SUB[ch] ?? ch
  return out
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/Δ/g, 'd')
    .replace(/⇌|⇄|→|←/g, ' ')
    .toLowerCase()
}

function stem(t: string): string {
  if (t.length <= 3 || /\d/.test(t)) return t
  if (t.endsWith('ies') && t.length > 4) return t.slice(0, -3) + 'y'
  if (t.endsWith('sses')) return t.slice(0, -2)
  if (t.endsWith('ing') && t.length > 5) return t.slice(0, -3)
  if (t.endsWith('ed') && t.length > 4) return t.slice(0, -2)
  if (t.endsWith('es') && t.length > 4 && /(ch|sh|x|z|ss)es$/.test(t)) return t.slice(0, -2)
  if (t.endsWith('s') && !t.endsWith('ss') && !t.endsWith('us') && !t.endsWith('is')) return t.slice(0, -1)
  return t
}

export function tokens(s: string): string[] {
  const f = fold(s)
    .replace(/sig\s*figs?/g, 'sigfig')
    .replace(/le\s*chat[a-z]*/g, 'chatelier')
    .replace(/hess'?s?/g, 'hess')
  const raw = f.split(/[^a-z0-9.+-]+/)
  const out: string[] = []
  for (let t of raw) {
    t = t.replace(/^[.+-]+|[.+-]+$/g, '')
    if (!t || STOP.has(t)) continue
    if (t.length === 1 && !/[kqrx0-9]/.test(t)) continue
    out.push(stem(t))
  }
  return out
}

export function expand(ts: string[]): { t: string; w: number }[] {
  const seen = new Map<string, number>()
  for (const t of ts) seen.set(t, Math.max(seen.get(t) ?? 0, 1))
  for (const t of ts) for (const s of SYNONYMS[t] ?? []) if (!seen.has(s)) seen.set(s, 0.35)
  return [...seen].map(([t, w]) => ({ t, w }))
}

/** Numbers written in a question or problem: "0.250", "1.8 × 10⁻⁵", "25". Used to spot copied problem text. */
export function numbers(s: string): string[] {
  const f = fold(s).replace(/\s*[x×]\s*10\^?\s*(-?\d+)/g, 'e$1')
  return (f.match(/\d+(?:\.\d+)?(?:e-?\d+)?/g) ?? []).filter((n) => n.length >= 2 || n.includes('.'))
}

/** Similarity of two short texts, 0–1, on content tokens. */
export function overlap(a: string, b: string): number {
  const A = new Set(tokens(a))
  const B = new Set(tokens(b))
  if (!A.size || !B.size) return 0
  let n = 0
  for (const t of A) if (B.has(t)) n++
  return (2 * n) / (A.size + B.size)
}
