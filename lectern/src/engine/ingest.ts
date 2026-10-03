import type { Passage, Source, SourceKind, SourceMode } from '../data/types'

export const ACCEPT = '.vtt,.srt,.txt,.md,.pdf,text/plain,text/vtt,application/pdf'

const fmt = (sec: number) => {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}

const words = (s: string) => s.split(/\s+/).filter(Boolean).length

/** WebVTT or SRT captions → passages of roughly 90 words, each stamped with its start time. */
export function parseCaptions(raw: string, prefix: string): Passage[] {
  const cues: { start: number; text: string }[] = []
  const blocks = raw.replace(/\r/g, '').split(/\n{2,}/)
  for (const b of blocks) {
    const m = b.match(/(\d{1,2}:)?(\d{1,2}):(\d{2})[.,](\d{1,3})\s*-->/)
    if (!m) continue
    const start = (m[1] ? Number(m[1].slice(0, -1)) * 3600 : 0) + Number(m[2]) * 60 + Number(m[3])
    const text = b
      .split('\n')
      .filter((l) => !/-->/.test(l) && !/^\d+$/.test(l.trim()) && !/^WEBVTT/.test(l))
      .join(' ')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (text) cues.push({ start, text })
  }
  const out: Passage[] = []
  let buf: string[] = []
  let at = 0
  for (const c of cues) {
    if (!buf.length) at = c.start
    buf.push(c.text)
    if (words(buf.join(' ')) >= 90) {
      out.push({ id: `${prefix}-${String(out.length + 1).padStart(2, '0')}`, loc: fmt(at), seconds: at, text: buf.join(' ') })
      buf = []
    }
  }
  if (buf.length) out.push({ id: `${prefix}-${String(out.length + 1).padStart(2, '0')}`, loc: fmt(at), seconds: at, text: buf.join(' ') })
  return out
}

/** Plain text or Markdown → passages split at headings and paragraphs, about 120 words each. */
export function parseText(raw: string, prefix: string, locWord = 'Part'): Passage[] {
  const lines = raw.replace(/\r/g, '').split('\n')
  const sections: { head?: string; body: string[] }[] = [{ body: [] }]
  for (const line of lines) {
    const h = line.match(/^#{1,4}\s+(.*)/)
    if (h) sections.push({ head: h[1].trim(), body: [] })
    else sections[sections.length - 1].body.push(line)
  }
  const out: Passage[] = []
  for (const sec of sections) {
    const paras = sec.body.join('\n').split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean)
    let buf = ''
    let part = 0
    const flush = () => {
      if (!buf) return
      part++
      const loc = sec.head ? (part > 1 ? `${sec.head} (${part})` : sec.head) : `${locWord} ${out.length + 1}`
      out.push({ id: `${prefix}-${String(out.length + 1).padStart(2, '0')}`, loc, text: buf })
      buf = ''
    }
    for (const p of paras) {
      buf = buf ? `${buf} ${p}` : p
      if (words(buf) >= 120) flush()
    }
    flush()
  }
  return out
}

let pdfjs: Promise<any> | null = null
function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Couldn’t load ${src}`))
    document.head.appendChild(s)
  })
}
function loadPdfJs() {
  if (!pdfjs) {
    const base = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/'
    // Loading the worker as a plain script lets pdf.js run on the main thread inside the sandbox.
    pdfjs = loadScript(base + 'pdf.min.js')
      .then(() => loadScript(base + 'pdf.worker.min.js'))
      .then(() => (window as any).pdfjsLib)
  }
  return pdfjs
}

async function parsePdf(file: File, prefix: string, slides: boolean): Promise<{ passages: Passage[]; pages: number }> {
  const lib = await loadPdfJs()
  const doc = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false }).promise
  const passages: Passage[] = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    const text = content.items.map((it: any) => it.str).join(' ').replace(/\s+/g, ' ').trim()
    if (text) passages.push({ id: `${prefix}-${String(i).padStart(2, '0')}`, loc: `${slides ? 'Slide' : 'Page'} ${i}`, text })
  }
  return { passages, pages: doc.numPages }
}

export function guessKind(name: string): SourceKind {
  const n = name.toLowerCase()
  if (/\.(vtt|srt)$/.test(n) || /lecture|transcript|recording/.test(n)) return 'lecture'
  if (/slide|deck/.test(n)) return 'slides'
  if (/syllabus/.test(n)) return 'syllabus'
  if (/pset|problem.?set|homework|hw\d/.test(n)) return 'pset'
  if (/exam|midterm|final/.test(n)) return 'exam'
  return 'upload'
}

let counter = 0
const newId = () => `U${Date.now().toString(36).slice(-4).toUpperCase()}${(counter++).toString(36).toUpperCase()}`

export async function sourceFromFile(file: File): Promise<Source> {
  const id = newId()
  const kind = guessKind(file.name)
  const title = file.name.replace(/\.[a-z0-9]+$/i, '').replace(/[_-]+/g, ' ').trim()
  let passages: Passage[]
  let meta: string
  if (/\.pdf$/i.test(file.name) || file.type === 'application/pdf') {
    const r = await parsePdf(file, id, kind === 'slides')
    passages = r.passages
    meta = `${r.pages} ${kind === 'slides' ? 'slides' : 'pages'} · PDF`
  } else {
    const raw = await file.text()
    if (/\.(vtt|srt)$/i.test(file.name) || /^WEBVTT/.test(raw) || /-->/.test(raw.slice(0, 400))) {
      passages = parseCaptions(raw, id)
      const last = passages[passages.length - 1]
      meta = `${last ? Math.ceil((last.seconds ?? 0) / 60) + 1 : 0} min · captions`
    } else {
      passages = parseText(raw, id)
      meta = `${words(raw).toLocaleString()} words · ${/\.md$/i.test(file.name) ? 'Markdown' : 'text'}`
    }
  }
  if (!passages.length) throw new Error(`No readable text found in ${file.name}.`)
  return finish({ id, kind, title, meta, passages })
}

export function sourceFromPaste(title: string, raw: string, kind: SourceKind): Source {
  const id = newId()
  const captions = /-->/.test(raw.slice(0, 600))
  const passages = captions ? parseCaptions(raw, id) : parseText(raw, id, kind === 'slides' ? 'Slide' : 'Part')
  if (!passages.length) throw new Error('Paste some text first.')
  return finish({ id, kind, title: title.trim() || 'Pasted notes', meta: `${words(raw).toLocaleString()} words · pasted`, passages })
}

function finish(s: { id: string; kind: SourceKind; title: string; meta: string; passages: Passage[] }): Source {
  const mode: SourceMode = s.kind === 'pset' ? 'recognize' : 'answer'
  return {
    ...s,
    date: new Date().toISOString(),
    origin: 'Added by you',
    proposed: 'approved',
    mode,
    note: mode === 'recognize' ? 'Treated as a current problem set: used only to recognize its questions so the tutor can decline them.' : undefined,
  }
}
