import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

/* An SVG in background-image cannot read a custom property, so the pen colours are baked in. */

const MODULE = 'virtual:tmpl-waves.css'
const here = (name: string) => fileURLToPath(new URL(`./styles/${name}`, import.meta.url))

const PATH = 'M0 4.5 C2 1.03 6 1.03 8 4.5 C10 7.97 14 7.97 16 4.5'

function wave(colour: string) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9' preserveAspectRatio='none'>` +
    `<path d='${PATH}' fill='none' stroke='${colour}' stroke-width='3.2' stroke-linecap='round'/>` +
    `</svg>`
  return `url("data:image/svg+xml,${svg.replace(/</g, '%3C').replace(/>/g, '%3E').replace(/#/g, '%23')}")`
}

function sheet() {
  const base = readFileSync(here('base.css'), 'utf8')
  const prose = readFileSync(here('prose.css'), 'utf8')

  const palette = new Map(
    [...base.matchAll(/--tmpl-([\w-]+):\s*(#[0-9a-f]{3,8})\s*;/gi)].map((m) => [m[1], m[2]]),
  )

  const colour = (token: string) => {
    const found = palette.get(token)
    if (!found) throw new Error(`waves: base.css declares no --tmpl-${token} colour`)
    return found
  }

  /* The first match is `ins` itself, whose rule names no class. */
  const pens = [
    ...prose.matchAll(
      /\.slidev-layout\s+(?:\S+\s+)?(\.[\w-]+|:is\([^)]*\bins\b[^)]*\))\s*\{\s*--tmpl-pen:\s*var\(--tmpl-([\w-]+)\)/g,
    ),
  ]

  const rules = pens
    .map(([, selector, token]) => {
      const on = selector.startsWith(':is') ? 'ins' : `ins${selector}`
      return `.slidev-layout ${on} {\n  --tmpl-wave: ${wave(colour(token))};\n}`
    })
    .join('\n\n')

  if (!rules) throw new Error('waves: prose.css declares no --tmpl-pen rules')
  return `/* Generated from base.css and prose.css by waves.ts. */\n${rules}\n`
}

export function waves(): Plugin {
  return {
    name: 'tmpl-waves',
    resolveId: (id) => (id === MODULE ? `\0${MODULE}` : null),
    load: (id) => (id === `\0${MODULE}` ? sheet() : null),
    configureServer(server) {
      server.watcher.on('change', (file) => {
        if (!file.endsWith('base.css') && !file.endsWith('prose.css')) return
        const mod = server.moduleGraph.getModuleById(`\0${MODULE}`)
        if (mod) server.reloadModule(mod)
      })
    },
  }
}
