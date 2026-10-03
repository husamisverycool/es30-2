// Turn Vite's single-file build into an Artifact page body: the publish step wraps it in
// its own doctype/head/body, so we emit title, font link, style, mount point and script only.
import { readFileSync, writeFileSync } from 'node:fs'

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')
const pick = (re) => [...html.matchAll(re)].map((m) => m[0])

const title = pick(/<title>[\s\S]*?<\/title>/g)[0] ?? '<title>Lectern</title>'
const links = pick(/<link rel="(?:preconnect|stylesheet)"[^>]*>/g).join('\n')
const styles = pick(/<style[^>]*>[\s\S]*?<\/style>/g).join('\n')
const scripts = pick(/<script type="module"[^>]*>[\s\S]*?<\/script>/g)
  .map((s) => s.replace(/ crossorigin(="[^"]*")?/, ''))
  .join('\n')

if (!scripts) throw new Error('No inline module script found in dist/index.html')
const out = `${title}\n${links}\n${styles}\n<div id="app"></div>\n${scripts}\n`
writeFileSync(new URL('../dist/lectern.html', import.meta.url), out)
console.log(`dist/lectern.html  ${(out.length / 1024).toFixed(1)} kB`)
