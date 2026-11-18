/* A deck's frontmatter is YAML, and the linter reads it as prose: `layout: image`
   above `image: /a.jpg` comes back as a repeated word. Only the slide bodies go in,
   blanked line for line so a warning still points at the line in the deck. */
import { spawnSync } from 'node:child_process'
import { globSync, readFileSync } from 'node:fs'
import { parse } from '@slidev/parser'

/* Swapping a mainland term for the Taiwanese one is mechanical, so those block the
   commit. The rest judge the writing and can be wrong, so they are printed and the
   writer decides. A linter that blocks on its own mistakes teaches --no-verify. */
const BLOCKING = new Set([
  'casing',
  'cross_strait',
  'dunhao',
  'ellipsis',
  'punctuation',
  'quotes',
  'range',
  'spacing',
  'spelling',
  'variant',
])

// The colon rule reads a slot marker, ::name::, as a sentence wanting a full-width colon.
const ARGS = ['lint', '--content-type', 'markdown', '--off', 'colon', '--format', 'json', '--']

function show(file, issues, label) {
  console.error(`${file}  ${label}`)
  for (const issue of issues) {
    const fix = issue.suggestions?.length ? ` -> ${issue.suggestions.join(' / ')}` : ''
    console.error(`  ${issue.line}:${issue.col} [${issue.rule_type}] ${issue.found}${fix}`)
  }
}

let bad = 0
const named = process.argv.slice(2)
for (const file of named.length ? named : globSync('decks/*/slides.md')) {
  const lines = readFileSync(file, 'utf8').split('\n')
  const prose = lines.map(() => '')
  for (const slide of (await parse(lines.join('\n'), file)).slides) {
    for (let n = slide.contentStart; n < slide.end; n++) prose[n - 1] = lines[n - 1]
  }

  const run = spawnSync('zhtw-mcp', ARGS, {
    input: prose.join('\n'),
    encoding: 'utf8',
    shell: true,
  })
  if (!run.stdout) {
    console.error(`${file}  zhtw-mcp produced no report\n${run.stderr}`)
    bad++
    continue
  }

  const issues = JSON.parse(run.stdout).issues ?? []
  const blocking = issues.filter((issue) => BLOCKING.has(issue.rule_type))
  const advice = issues.filter((issue) => !BLOCKING.has(issue.rule_type))

  if (advice.length) show(file, advice, 'worth a look')
  if (blocking.length) {
    show(file, blocking, 'must fix')
    bad++
  }
}

process.exit(bad ? 1 : 0)
