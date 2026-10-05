// The professor's own course, packed into one static page students can open anywhere (Netlify Drop, Canvas files).
// This MVP has no server, so the page carries the approved materials and rules with it.
import type { State } from './store'
import type { CourseMeta } from './workspace'

export interface Published {
  v: 1
  id: string
  meta: CourseMeta
  publishedAt: string
  state: Pick<State, 'statuses' | 'uploads' | 'rules' | 'customRules' | 'corrections'>
}

/** Set when this page is a downloaded student page rather than the console. */
export const published: Published | null =
  typeof window !== 'undefined' ? ((window as unknown as { __LECTERN_PUBLISHED__?: Published }).__LECTERN_PUBLISHED__ ?? null) : null

const appScript = () => document.querySelector('script[type="module"]:not([src])')?.textContent ?? ''

/** The dev server loads the app from files, so only a built page can copy itself. */
export const canPublish = () => typeof document !== 'undefined' && appScript().length > 0

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'course'
const escHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const fileBase = (meta: CourseMeta) => `${slug(meta.code)}-tutor`

/** Only approved materials leave this browser; anything left out stays behind. */
export function studentPage(meta: CourseMeta, s: State): string {
  const code = appScript()
  if (!code) throw new Error('Download works from the built page, not the dev server.')
  const css = [...document.querySelectorAll('style')].map((x) => x.textContent ?? '').join('\n')
  const links = [...document.head.querySelectorAll('link[rel="icon"],link[rel="preconnect"],link[rel="stylesheet"]')].map((l) => l.outerHTML).join('\n')
  const uploads = s.uploads.filter((u) => (s.statuses[u.id] ?? 'approved') === 'approved')
  const data: Published = {
    v: 1,
    id: slug(`${meta.code} ${meta.term}`),
    meta,
    publishedAt: new Date().toISOString(),
    state: { statuses: Object.fromEntries(uploads.map((u) => [u.id, 'approved'])), uploads, rules: s.rules, customRules: s.customRules, corrections: s.corrections },
  }
  // "<" escaped so no passage text can close the script tag early.
  const json = JSON.stringify(data).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${escHtml(meta.code)} Tutor</title>
<meta name="description" content="${escHtml(`A study tutor for ${meta.code}, built only from materials ${meta.profShort || meta.profName} approved.`)}">
${links}
<style>${css}</style>
<script>window.__LECTERN_PUBLISHED__=${json}</script>
<script type="module">${code}</script>
</head>
<body><div id="app"></div></body>
</html>
`
}

const CRC = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
function crc32(b: Uint8Array) {
  let c = 0xffffffff
  for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

/** A one-file zip (stored, not compressed): what Netlify Drop expects, with index.html at the root. */
export function zipOne(name: string, text: string): Blob {
  const data = new TextEncoder().encode(text)
  const nm = new TextEncoder().encode(name)
  const d = new Date()
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)
  const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()
  const crc = crc32(data)
  const local = new DataView(new ArrayBuffer(30))
  local.setUint32(0, 0x04034b50, true)
  local.setUint16(4, 20, true)
  local.setUint16(6, 0x0800, true)
  local.setUint16(8, 0, true)
  local.setUint16(10, time, true)
  local.setUint16(12, date, true)
  local.setUint32(14, crc, true)
  local.setUint32(18, data.length, true)
  local.setUint32(22, data.length, true)
  local.setUint16(26, nm.length, true)
  local.setUint16(28, 0, true)
  const central = new DataView(new ArrayBuffer(46))
  central.setUint32(0, 0x02014b50, true)
  central.setUint16(4, 20, true)
  central.setUint16(6, 20, true)
  central.setUint16(8, 0x0800, true)
  central.setUint16(10, 0, true)
  central.setUint16(12, time, true)
  central.setUint16(14, date, true)
  central.setUint32(16, crc, true)
  central.setUint32(20, data.length, true)
  central.setUint32(24, data.length, true)
  central.setUint16(28, nm.length, true)
  central.setUint32(42, 0, true)
  const cdOffset = 30 + nm.length + data.length
  const end = new DataView(new ArrayBuffer(22))
  end.setUint32(0, 0x06054b50, true)
  end.setUint16(8, 1, true)
  end.setUint16(10, 1, true)
  end.setUint32(12, 46 + nm.length, true)
  end.setUint32(16, cdOffset, true)
  return new Blob([local.buffer, nm, data, central.buffer, nm, end.buffer], { type: 'application/zip' })
}

export function saveFile(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
