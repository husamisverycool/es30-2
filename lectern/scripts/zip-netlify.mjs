// Package dist/ for Netlify Drop: a zip with index.html at its root.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, copyFileSync, rmSync, statSync } from 'node:fs'

const out = new URL('../netlify/', import.meta.url).pathname
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
copyFileSync(new URL('../dist/index.html', import.meta.url), out + 'index.html')
const zip = new URL('../../lectern-netlify.zip', import.meta.url).pathname
if (existsSync(zip)) rmSync(zip)
execFileSync('zip', ['-j', '-q', zip, out + 'index.html'])
console.log(`${zip}  ${(statSync(zip).size / 1024).toFixed(1)} kB`)
