// Builds every deck under decks/ into one static site and writes the index
// that links them.
//
// A Slidev SPA bakes its base path into asset URLs at build time and Pages
// serves a project site under the repository name, so --base is given rather
// than discovered, and the same tree builds for Pages and for a local check.

import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, resolveConfig } from '@slidev/parser'
import { indexFonts } from './fonts.mjs'
import { page } from './page.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'dist')

function flag(name, fallback) {
  const at = process.argv.indexOf(`--${name}`)
  return at === -1 ? fallback : process.argv[at + 1]
}

const trimmed = flag('base', '/').replace(/^\/+|\/+$/g, '')
const base = trimmed ? `/${trimmed}/` : '/'

// Rewriting the index takes 0.3 seconds against 18 for a deck, so this leaves
// the decks already in dist/ alone and can describe one older than itself.
const indexOnly = process.argv.includes('--index-only')

// Pages reports a custom domain over http until HTTPS is enforced on it, and
// a crawler takes og:url literally, so anything that is not a local preview is
// named by https.
const given = (flag('origin', '') || '').replace(/\/+$/, '')
const origin = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(given)
  ? given
  : given.replace(/^http:\/\//, 'https://')

// Slidev's own entry rather than `pnpm exec`, because the .CMD shim needs a
// shell on Windows and a shell needs the arguments quoted differently again.
function slidev(deck, args) {
  const cli = path.join(deck.dir, 'node_modules', '@slidev', 'cli', 'bin', 'slidev.mjs')
  execFileSync(process.execPath, [cli, ...args], { cwd: deck.dir, stdio: 'inherit' })
}

// Reading the grid back out of base.css keeps the index from drifting from the
// theme it describes. A renamed token would otherwise reach the page as "null",
// which reads as a fact rather than a missing one.
function pixels(css, theme, name) {
  const match = css.match(new RegExp(`--tmpl-${name}:\\s*([^;]+);`))
  if (!match) throw new Error(`${theme}: base.css declares no --tmpl-${name}`)
  const value = Number.parseInt(match[1], 10)
  if (!Number.isFinite(value)) throw new Error(`${theme}: --tmpl-${name} is not a length`)
  return value
}

function resolveTheme(deckDir, named) {
  if (!named) throw new Error(`${path.basename(deckDir)}: slides.md names no theme`)

  const candidates = named.startsWith('.')
    ? [path.resolve(deckDir, named)]
    : [
        path.join(root, 'themes', named.replace(/^slidev-theme-/, '')),
        path.join(root, 'themes', named),
      ]

  const found = candidates.find((dir) => existsSync(path.join(dir, 'package.json')))
  if (found) return found
  const tried = candidates.map((dir) => path.relative(root, dir)).join(', ')
  throw new Error(`${path.basename(deckDir)}: no theme "${named}"; looked in ${tried}`)
}

async function readDeck(name) {
  const dir = path.join(root, 'decks', name)
  const file = path.join(dir, 'slides.md')

  const parsed = await parse(await readFile(file, 'utf8'), file)
  const head = parsed.slides[0].frontmatter
  const themeDir = resolveTheme(dir, head.theme)
  const theme = JSON.parse(await readFile(path.join(themeDir, 'package.json'), 'utf8'))
  const css = await readFile(path.join(themeDir, 'styles', 'base.css'), 'utf8')

  const config = resolveConfig(head, theme.slidev ?? {}, file)
  const width = config.canvasWidth
  const height = Math.round(width / config.aspectRatio)
  const themeName = path.basename(themeDir)
  const cell = pixels(css, themeName, 'cell')

  return {
    name,
    dir,
    theme: themeName,
    title: head.title ?? name,
    preview: head.preview ?? [1],
    count: parsed.slides.length,
    description: theme.description ?? '',
    fonts: theme.slidev?.defaults?.fonts ?? {},
    layouts: (await readdir(path.join(themeDir, 'layouts')))
      .filter((file) => file.endsWith('.vue'))
      .map((file) => path.basename(file, '.vue'))
      .sort(),
    width,
    height,
    cell,
    columns: width / cell,
    rows: height / cell,
    title_size: pixels(css, themeName, 'title-size'),
    body_size: pixels(css, themeName, 'body-size'),
  }
}

// A deck needs every chunk of a split CJK face, because its text is whatever
// the author writes next. This page does not, because its text is fixed by the
// time it is built, so filtering the chunks and rules down to the characters it
// sets turns ~25 MB and 300 rules a weight into a handful.
function wanted(rule, codepoints) {
  const range = /unicode-range:([^;}]+)/.exec(rule)
  if (!range) return true

  return range[1].split(',').some((part) => {
    const [from, to] = part.trim().replace(/^U\+/i, '').split('-')
    const low = Number.parseInt(from, 16)
    const high = to === undefined ? low : Number.parseInt(to, 16)
    for (const code of codepoints) if (code >= low && code <= high) return true
    return false
  })
}

// Slidev bundles every face the theme ships into one render-blocking
// stylesheet and emits a chunk for each. A deck's text is fixed once it is
// built, so the chunks it can ever ask for are known, and the rest are weight
// the reader pays for and never uses.
//
// What is kept is preloaded, because a unicode-range face is fetched only
// when a glyph in its range is first painted, which is the moment the slide
// carrying it appears, in front of an audience.
async function narrowDeckFonts(out, base) {
  const assets = path.join(out, 'assets')
  if (!existsSync(assets)) return

  // Slidev nests some of its own chunks, and the font chunks sit at the top.
  const entries = await readdir(assets, { withFileTypes: true, recursive: true })
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name))

  const sheets = []
  const text = [await readFile(path.join(out, 'index.html'), 'utf8')]
  const chunks = new Map()
  for (const file of files) {
    const name = path.basename(file)
    if (name.endsWith('.woff2')) {
      chunks.set(name, file)
      continue
    }
    if (/\.(?:woff|ttf|otf|png|jpe?g|gif|webp|svg|ico|map)$/i.test(name)) continue
    const body = await readFile(file, 'utf8')
    if (name.endsWith('.css') && body.includes('@font-face')) sheets.push({ file, body })
    else text.push(body)
  }
  if (sheets.length === 0) return

  const codepoints = new Set(text.flatMap((body) => [...body].map((c) => c.codePointAt(0))))

  const keep = new Set()
  let dropped = 0
  for (const sheet of sheets) {
    const narrowed = sheet.body.replace(/@font-face\{[^}]*\}/g, (rule) => {
      if (!wanted(rule, codepoints)) {
        dropped += 1
        return ''
      }
      // Vite inlines a small face as a data URI, which is already in the
      // sheet and names no file.
      const url = /url\(([^)]+)\)/.exec(rule)
      const href = url?.[1].replace(/["']/g, '')
      if (href?.endsWith('.woff2')) keep.add(path.basename(href))
      return rule
    })
    await writeFile(sheet.file, narrowed, 'utf8')
  }

  let removed = 0
  for (const [name, file] of chunks) {
    if (keep.has(name)) continue
    await rm(file)
    removed += 1
  }

  const links = [...keep]
    .sort()
    .map(
      (name) =>
        `<link rel="preload" as="font" type="font/woff2" crossorigin href="${base}assets/${name}">`,
    )
    .join('\n')
  const page = path.join(out, 'index.html')
  const html = await readFile(page, 'utf8')
  await writeFile(page, html.replace('</head>', `${links}\n</head>`), 'utf8')

  console.log(`  fonts: kept ${keep.size} chunks, dropped ${dropped} faces and ${removed} files`)
}

async function copyFonts(html) {
  const themesDir = path.join(root, 'themes')
  const fontsOut = path.join(outDir, 'fonts')
  const codepoints = new Set([...html].map((char) => char.codePointAt(0)))
  const faces = []

  // The kept set shrinks as well as grows when the page's text changes.
  await rm(fontsOut, { recursive: true, force: true })

  for (const { theme, slug } of indexFonts) {
    const fontsDir = path.join(themesDir, theme, 'styles', 'fonts')
    if (!existsSync(path.join(fontsDir, slug))) {
      throw new Error(`themes/${theme} does not ship ${slug}; run pnpm fonts`)
    }
    const css = await readFile(path.join(fontsDir, slug, 'result.css'), 'utf8')
    await mkdir(path.join(fontsOut, slug), { recursive: true })

    for (const [rule] of css.matchAll(/@font-face\{[^}]*\}/g)) {
      if (!wanted(rule, codepoints)) continue

      const chunk = /url\("\.\/([^"]+)"\)/.exec(rule)
      if (!chunk) throw new Error(`${slug}: a face names no chunk`)

      await cp(path.join(fontsDir, slug, chunk[1]), path.join(fontsOut, slug, chunk[1]))
      faces.push(rule.replace('./', `./${slug}/`))
    }

    // The OFL binds redistribution, so each family's licence travels with it.
    const family = slug.replace(/-\d+$/, '')
    for (const file of await readdir(fontsDir)) {
      if (file.startsWith(family) && file.endsWith('.txt')) {
        await cp(path.join(fontsDir, file), path.join(fontsOut, file))
      }
    }
  }

  await writeFile(path.join(fontsOut, 'fonts.css'), `${faces.join('\n')}\n`, 'utf8')
}

const names = (await readdir(path.join(root, 'decks'), { withFileTypes: true }))
  .filter(
    (entry) =>
      entry.isDirectory() && existsSync(path.join(entry.parentPath, entry.name, 'slides.md')),
  )
  .map((entry) => entry.name)
  .sort()

if (names.length === 0) throw new Error('decks/ holds no deck')

if (!indexOnly) await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

const decks = []

for (const name of names) {
  const deck = await readDeck(name)
  const out = path.join(outDir, 't', name)

  if (!indexOnly) {
    console.log(`${name}: building`)
    // Pages has no SPA fallback, so reloading on /t/<name>/5 would otherwise
    // ask the server for a path that is not there.
    slidev(deck, [
      'build',
      'slides.md',
      '--base',
      `${base}t/${name}/`,
      '--out',
      out,
      '--router-mode',
      'hash',
    ])

    await narrowDeckFonts(out, `${base}t/${name}/`)

    console.log(`${name}: shooting slides ${deck.preview.join(', ')}`)
    slidev(deck, [
      'export',
      'slides.md',
      '--format',
      'png',
      '--range',
      deck.preview.join(','),
      // Full 1920x1080, because the cover is shown near a megapixel wide.
      '--output',
      path.join(out, 'preview'),
    ])
  }

  decks.push(deck)
}

// The page is a list of themes but the build is keyed on decks. Two decks on
// one theme would list it twice, with one description and two ticks.
const byTheme = new Map()
for (const deck of decks) {
  const seen = byTheme.get(deck.theme)
  if (seen) throw new Error(`${seen} and ${deck.name} are both decks for themes/${deck.theme}`)
  byTheme.set(deck.theme, deck.name)
}

for (const theme of await readdir(path.join(root, 'themes'), { withFileTypes: true })) {
  if (!theme.isDirectory() || byTheme.has(theme.name)) continue
  if (!existsSync(path.join(theme.parentPath, theme.name, 'package.json'))) continue
  console.log(`themes/${theme.name}: no deck points at it, so it is not on the index`)
}

const repo = flag('repo', 'https://github.com/yuto0226/slidev-tmpl')
const html = page(decks, { base, origin, repo, fonts: indexFonts })

// Which chunks the page needs is read off its rendered text, so the page is
// rendered before the fonts are copied.
await copyFonts(html)

await writeFile(path.join(outDir, 'index.html'), html, 'utf8')

console.log(`\n${decks.length} theme(s) into dist/ at ${base}`)
