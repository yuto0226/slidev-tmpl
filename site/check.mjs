import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { indexFonts } from './fonts.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'dist')
const sourceDir = path.join(root, 'site')

const failures = []
let checked = 0

function check(what, condition, detail = '') {
  checked += 1
  if (!condition) failures.push(detail ? `${what}\n      ${detail}` : what)
}

const read = (file) => readFileSync(file, 'utf8')

const markup = read(path.join(sourceDir, 'page.mjs'))

const sources = [...markup.matchAll(/new URL\('\.\/([^']+)'/g)].map((match) => match[1])
check('page.mjs names the files it inlines', sources.length > 0)

const styles = sources
  .filter((file) => file.endsWith('.css'))
  .map((file) => read(path.join(sourceDir, file)))
  .join('\n')
check('the page inlines a stylesheet', styles.length > 0)

// Reading an undeclared property is not an error; it silently keeps its initial value.
const declared = new Set([
  ...[...styles.matchAll(/(?:^|[;{]|@property)\s*(--[\w-]+)\s*[:{\n]/gm)].map((m) => m[1]),
  ...[...markup.matchAll(/(--[\w-]+):/g)].map((m) => m[1]),
  // Set by the build, so no file declares them.
  ...indexFonts.map(({ role }) => `--${role}`),
])

const used = new Set([...styles.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]))
const undeclared = [...used].filter((name) => !declared.has(name))
check(
  'every custom property the stylesheets read is set somewhere',
  undeclared.length === 0,
  undeclared.join(', '),
)

const unread = [...declared].filter(
  (name) => !used.has(name) && !markup.includes(`${name}:`) && styles.includes(`${name}:`),
)
check('no custom property is declared and never read', unread.length === 0, unread.join(', '))

// Only an untracked file can break a clean checkout, and CI has none, so this runs pre-commit.
const tracked = new Set(
  execFileSync('git', ['ls-files', 'site'], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
    .map((file) => file.replaceAll('\\', '/')),
)
for (const file of [...sources, 'page.mjs']) {
  check(`site/${file} is tracked`, tracked.has(`site/${file}`), 'page.mjs reads it')
}

if (!existsSync(path.join(outDir, 'index.html'))) {
  console.log('site/ is not built; checked the sources only\n')
} else {
  const html = read(path.join(outDir, 'index.html'))

  for (const leak of ['undefined', 'NaN', '[object Object]', '>null<']) {
    check(`no ${leak} reached the page`, !html.includes(leak))
  }

  const base = /<link rel="stylesheet" href="([^"]*)fonts\/fonts\.css">/.exec(html)?.[1] ?? '/'
  const referenced = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
    .map((match) => match[1])
    .filter((url) => url.startsWith(base) && !url.startsWith('//'))
  const dangling = referenced.filter(
    (url) => !existsSync(path.join(outDir, url.slice(base.length))),
  )
  check(
    `all ${referenced.length} local references resolve`,
    dangling.length === 0,
    dangling.join(', '),
  )

  for (const { role, family } of indexFonts) {
    check(`the page is given its ${role} face`, html.includes(`--${role}: '${family}'`))
  }

  const fontCss = path.join(outDir, 'fonts', 'fonts.css')
  check('fonts.css was written', existsSync(fontCss))
  if (existsSync(fontCss)) {
    const css = read(fontCss)
    const faces = [...css.matchAll(/url\("([^"]+)"\)/g)].map((match) => match[1])
    check('fonts.css declares faces', faces.length > 0)
    for (const { family } of indexFonts) {
      check(`fonts.css carries ${family}`, css.includes(`font-family:"${family}"`))
    }
    const absent = faces.filter(
      (url) => !existsSync(path.join(outDir, 'fonts', url.replace(/^\.\//, ''))),
    )
    check(`all ${faces.length} font chunks were copied`, absent.length === 0, absent.join(', '))
    check(
      'each family brought its licence',
      readdirSync(path.join(outDir, 'fonts')).filter((file) => file.endsWith('.txt')).length > 0,
    )
  }

  for (const [, name] of html.matchAll(/<li class="theme" id="([^"]+)"/g)) {
    const built = path.join(outDir, 't', name, 'index.html')
    check(`${name} was built`, existsSync(built) && statSync(built).size > 0)
    if (existsSync(built)) deck(name, built)
  }
}

// An uncovered glyph falls back silently, so this checks the chunks the build kept.
function deck(name, page) {
  const dir = path.dirname(page)
  const assets = path.join(dir, 'assets')
  if (!existsSync(assets)) return

  const files = readdirSync(assets, { recursive: true })
    .map((file) => path.join(assets, file))
    .filter((file) => statSync(file).isFile())

  // Preload hrefs carry --base, so match from the deck's own directory onward.
  const here = path.relative(outDir, dir).split(path.sep).join('/')
  const missing = [...read(page).matchAll(/rel="preload" as="font"[^>]*href="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((url) => {
      const at = url.indexOf(`/${here}/`)
      return at === -1 || !existsSync(path.join(outDir, url.slice(at + 1)))
    })
  check(`${name} preloads fonts that are there`, missing.length === 0, missing.join(', '))

  const covered = []
  const text = [read(page)]
  for (const file of files) {
    if (/\.(?:woff2?|ttf|otf|png|jpe?g|gif|webp|svg|ico|map)$/i.test(file)) continue
    const body = read(file)
    if (file.endsWith('.css') && body.includes('@font-face')) {
      for (const [, range] of body.matchAll(/unicode-range:([^;}]+)/g)) {
        for (const part of range.split(',')) {
          const [from, to] = part.trim().replace(/^U\+/i, '').split('-')
          const low = Number.parseInt(from, 16)
          covered.push([low, to === undefined ? low : Number.parseInt(to, 16)])
        }
      }
    } else {
      text.push(body)
    }
  }
  if (covered.length === 0) return

  // Latin and punctuation ride in faces with no range.
  const uncovered = new Set()
  for (const body of text) {
    for (const char of body) {
      const code = char.codePointAt(0)
      if (code < 0x2e80) continue
      // Variation selectors and format characters have no glyph of their own.
      if (/[\p{Cf}︀-️\u{E0100}-\u{E01EF}]/u.test(char)) continue
      if (!covered.some(([low, high]) => code >= low && code <= high)) uncovered.add(char)
    }
  }
  check(
    `${name} ships a face for every glyph it sets`,
    uncovered.size === 0,
    [...uncovered].join(' '),
  )
}

if (failures.length > 0) {
  console.error(`\n${failures.length} of ${checked} checks failed:\n`)
  for (const failure of failures) console.error(`  ✗ ${failure}`)
  process.exit(1)
}
console.log(`${checked} checks passed`)
