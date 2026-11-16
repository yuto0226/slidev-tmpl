// dev falls back to DEFAULT rather than to whichever deck sorts first, so
// adding a deck cannot change what `pnpm dev` opens.
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT = 'original'
const ONE_AT_A_TIME = new Set(['dev'])

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const decksDir = path.join(root, 'decks')

const fail = (message) => {
  console.error(message)
  process.exit(1)
}

const [script, ...rest] = process.argv.slice(2)
if (!script) fail('deck.mjs needs a script to run')

const decks = readdirSync(decksDir).filter((name) =>
  existsSync(path.join(decksDir, name, 'slides.md')),
)
if (decks.length === 0) fail('decks/ holds no deck')

// A leading dash means the argument is Slidev's, not a deck name.
const named = rest[0] && !rest[0].startsWith('-') ? rest[0] : undefined
const args = named ? rest.slice(1) : rest

if (named && !decks.includes(named)) {
  fail(`no deck named ${named}\n  ${decks.join('\n  ')}`)
}

let chosen
if (named) chosen = [named]
else if (!ONE_AT_A_TIME.has(script)) chosen = decks
else if (decks.includes(DEFAULT)) chosen = [DEFAULT]
else fail(`pnpm ${script} takes one deck and there is no ${DEFAULT}\n  ${decks.join('\n  ')}`)

// Node refuses to spawn a .cmd, so this runs the deck's own Slidev rather
// than pnpm's shim. dev is Slidev's default verb and passes none.
for (const deck of chosen) {
  const dir = path.join(decksDir, deck)
  const cli = path.join(dir, 'node_modules', '@slidev', 'cli', 'bin', 'slidev.mjs')
  if (!existsSync(cli)) fail(`${deck} has no Slidev; run pnpm install`)

  const verb = script === 'dev' ? ['slides.md', '--open'] : [script, 'slides.md']
  execFileSync(process.execPath, [cli, ...verb, ...args], { cwd: dir, stdio: 'inherit' })
}
