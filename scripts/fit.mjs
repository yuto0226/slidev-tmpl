import { spawn } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from '@slidev/parser'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const decksDir = path.join(root, 'decks')

const fail = (message) => {
  console.error(message)
  process.exit(1)
}

const decks = readdirSync(decksDir).filter((name) =>
  existsSync(path.join(decksDir, name, 'slides.md')),
)
const named = process.argv[2]
if (named && !decks.includes(named)) fail(`no deck named ${named}\n  ${decks.join('\n  ')}`)
const chosen = named ? [named] : decks

// Content outside these boxes is placed by the theme and cannot overflow.
const BOXES = '.tmpl-body, .tmpl-area, .tmpl-cols > *, .tmpl-rows > *'

function overflows(selector) {
  const found = []
  for (const box of document.querySelectorAll(selector)) {
    const rect = box.getBoundingClientRect()
    if (!rect.width || !rect.height) continue
    const where = box.className.split(' ').at(-1) || box.tagName

    const scrolled = box.scrollHeight - box.clientHeight
    if (scrolled > 1) found.push(`${where} is ${scrolled}px taller than its box`)

    for (const child of box.children) {
      if (getComputedStyle(child).position === 'absolute') continue
      const childRect = child.getBoundingClientRect()
      if (!childRect.height) continue
      const past = Math.round(childRect.bottom - rect.bottom)
      if (past > 1) found.push(`${where} holds a child ${past}px past its bottom edge`)
    }
  }
  return found
}

async function ready(url, deadline) {
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url)
      if (response.ok) return true
    } catch {}
  }
  return false
}

let bad = 0
for (const deck of chosen) {
  const dir = path.join(decksDir, deck)
  const cli = path.join(dir, 'node_modules', '@slidev', 'cli', 'bin', 'slidev.mjs')
  if (!existsSync(cli)) fail(`${deck} has no Slidev; run pnpm install`)

  const require = createRequire(path.join(dir, 'package.json'))
  const { chromium } = require('playwright-chromium')

  const file = path.join(dir, 'slides.md')
  const slides = (await parse(readFileSync(file, 'utf8'), file)).slides.length
  const port = 3000 + Math.floor(Math.random() * 1000)
  const server = spawn(process.execPath, [cli, 'slides.md', '--port', String(port)], {
    cwd: dir,
    stdio: 'ignore',
  })

  try {
    const url = `http://localhost:${port}`
    if (!(await ready(url, Date.now() + 60_000))) fail(`${deck}: dev server did not start`)

    const browser = await chromium.launch()
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    for (let n = 1; n <= slides; n++) {
      await page.goto(`${url}/${n}`, { waitUntil: 'networkidle' })
      await page.evaluate(() => document.fonts.ready)
      const found = await page.evaluate(overflows, BOXES)
      for (const line of found) {
        console.error(`  ${deck} slide ${n}: ${line}`)
        bad++
      }
    }
    await browser.close()
  } finally {
    server.kill()
  }
  console.log(`  ${deck}: ${slides} slides measured`)
}

if (bad) fail(`${bad} box${bad === 1 ? '' : 'es'} overflow`)
console.log('no slide overflows its boxes')
