// Markdown-lite used by tutor answers: paragraphs, "- " and "1. " lists, "> " quotes,
// **bold**, and [[PASSAGE_ID]] citation markers.

export type Inline = { t: 'text'; v: string } | { t: 'b'; v: string } | { t: 'cite'; id: string }
export type Block =
  | { t: 'p'; c: Inline[] }
  | { t: 'quote'; c: Inline[] }
  | { t: 'ul'; items: Inline[][] }
  | { t: 'ol'; items: Inline[][] }

export function inline(s: string): Inline[] {
  const out: Inline[] = []
  const re = /\*\*([^*]+)\*\*|\s?\[\[([A-Za-z0-9_.:-]+)\]\]/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ t: 'text', v: s.slice(last, m.index) })
    if (m[1] != null) out.push({ t: 'b', v: m[1] })
    else out.push({ t: 'cite', id: m[2] })
    last = re.lastIndex
  }
  if (last < s.length) out.push({ t: 'text', v: s.slice(last) })
  return out
}

export function parse(body: string): Block[] {
  const blocks: Block[] = []
  for (const chunk of body.replace(/\r/g, '').split(/\n\s*\n/)) {
    const lines = chunk.split('\n').filter((l) => l.trim())
    if (!lines.length) continue
    if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) {
      blocks.push({ t: 'ul', items: lines.map((l) => inline(l.replace(/^\s*[-•*]\s+/, ''))) })
    } else if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
      blocks.push({ t: 'ol', items: lines.map((l) => inline(l.replace(/^\s*\d+[.)]\s+/, ''))) })
    } else if (lines.every((l) => /^\s*>/.test(l))) {
      blocks.push({ t: 'quote', c: inline(lines.map((l) => l.replace(/^\s*>\s?/, '')).join(' ')) })
    } else {
      // A paragraph followed directly by bullets on the next lines.
      const firstBullet = lines.findIndex((l) => /^\s*([-•*]|\d+[.)])\s+/.test(l))
      if (firstBullet > 0 && lines.slice(firstBullet).every((l) => /^\s*([-•*]|\d+[.)])\s+/.test(l))) {
        blocks.push({ t: 'p', c: inline(lines.slice(0, firstBullet).join(' ')) })
        const ordered = /^\s*\d/.test(lines[firstBullet])
        const items = lines.slice(firstBullet).map((l) => inline(l.replace(/^\s*([-•*]|\d+[.)])\s+/, '')))
        blocks.push(ordered ? { t: 'ol', items } : { t: 'ul', items })
      } else {
        blocks.push({ t: 'p', c: inline(lines.join(' ')) })
      }
    }
  }
  return blocks
}

/** Citation ids in order of first appearance, for numbering chips 1, 2, 3… */
export function citationOrder(body: string): string[] {
  const seen: string[] = []
  for (const m of body.matchAll(/\[\[([A-Za-z0-9_.:-]+)\]\]/g)) if (!seen.includes(m[1])) seen.push(m[1])
  return seen
}

export const plain = (body: string) => body.replace(/\s?\[\[[^\]]+\]\]/g, '').replace(/\*\*/g, '').replace(/^>\s?/gm, '')
