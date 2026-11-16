import { readFile } from 'node:fs/promises'

const style = await readFile(new URL('./index.css', import.meta.url), 'utf8')

const title = "Yuto's Slidev Template"
const description = 'Yuto 做簡報用的 Slidev 主題都放在這裡，一個場合一套，每套附一份展示用的 deck。'

const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
const escape = (text) => String(text).replace(/[&<>"]/g, (char) => entities[char])

// Indents every line of a value to match the literal in front of its
// placeholder, so a piece of markup is written at its own indentation and
// nests anywhere. A placeholder alone on its line takes the line with it
// when its value is empty.
//
// Prettier reformats an html`` template, including the indentation this
// reads, so the tag is named markup.
function markup(strings, ...values) {
  let out = strings[0]
  for (let at = 0; at < values.length; at++) {
    const value = Array.isArray(values[at]) ? values[at].join('\n') : String(values[at])
    const next = strings[at + 1]
    const pad = /\n([ \t]*)$/.exec(strings[at])?.[1]
    if (value === '' && pad !== undefined && next.startsWith('\n')) {
      out = out.slice(0, out.length - pad.length) + next.slice(1)
      continue
    }
    out += (pad ? value.replaceAll('\n', `\n${pad}`) : value) + next
  }
  return out
}

function specs(deck) {
  const stack = (faces) => [faces].flat().join(' ')
  const rows = [
    ['canvas', `${deck.width} × ${deck.height}pt`],
    ['grid', `${deck.cell}pt cell, ${deck.columns} × ${deck.rows}`],
    ['type', `${deck.title_size}pt title / ${deck.body_size}pt body`],
    ['sans', stack(deck.fonts.sans)],
    ['mono', stack(deck.fonts.mono)],
    ['layouts', deck.layouts.join(', ')],
  ]

  return rows
    .filter(([, value]) => value)
    .map(([key, value]) => `<div><dt>${key}</dt><dd>${escape(value)}</dd></div>`)
}

// The heading comes before the slides it names, or from the second theme on
// they would fall under the heading above.
function card(deck, { base }, first) {
  const href = `${base}t/${deck.name}/`
  const [cover, ...rest] = deck.preview

  const shot = (slide, target, alt, eager) =>
    `<a class="shot" href="${target}"><img src="${href}preview/${slide}.png" alt="${alt}"${eager ? '' : ' loading="lazy"'} width="${deck.width}" height="${deck.height}"></a>`

  const plate = markup`<div class="plate" style="--columns: ${deck.columns}; --rows: ${deck.rows}">
  ${shot(cover, href, `${escape(deck.title)} 的封面`, first)}
  <span class="ticks ticks-x" aria-hidden="true"></span>
  <span class="ticks ticks-y" aria-hidden="true"></span>
  <span class="rule rule-x" aria-hidden="true" style="--measure: ${deck.width}"><i>${deck.width}</i></span>
  <span class="rule rule-y" aria-hidden="true" style="--measure: ${deck.height}"><i>${deck.height}</i></span>
</div>`

  const prints = rest.map((slide) =>
    shot(slide, `${href}#${slide}`, `${escape(deck.title)} 第 ${slide} 頁`, false),
  )

  return markup`<li class="theme" id="${deck.name}">
  <h2 class="name">
    <a href="${href}">${escape(deck.title)}</a>
    <span>${deck.count} slides</span>
  </h2>
  <p class="about">${escape(deck.description)}</p>
  <div class="sheet">
    ${plate}
    ${prints}
  </div>
  <dl class="spec">
    ${specs(deck)}
  </dl>
</li>`
}

// A crawler has no page to resolve a relative URL against, so these are
// emitted only when the origin they need is given.
function sharing(decks, { base, origin }) {
  if (!origin) return ''
  const first = decks[0]
  // Slides are exported at twice the canvas.
  const scale = 2
  return `<meta property="og:type" content="website">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${origin}${base}">
<meta property="og:image" content="${origin}${base}t/${first.name}/preview/${first.preview[0]}.png">
<meta property="og:image:width" content="${first.width * scale}">
<meta property="og:image:height" content="${first.height * scale}">
<meta name="twitter:card" content="summary_large_image">`
}

const githubMark = `<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27s-1.36.09-2 .27c-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/></svg>`

export function page(decks, site) {
  // The faces the build actually copied. Spelling a family in the stylesheet
  // instead let the two disagree in silence, and the page fell back to a
  // system face with every check still passing.
  const faces = site.fonts.map(({ role, family }) => `--${role}: '${family}';`)

  return markup`<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}">
${sharing(decks, site)}
<link rel="stylesheet" href="${site.base}fonts/fonts.css">
<style>
:root {
  ${faces}
}
${style}
</style>
</head>
<body>
<main>
  <header>
    <h1>slidev-tmpl</h1>
    <p>Yuto's Slidev Template</p>
  </header>
  <ul>
    ${decks.map((deck, at) => card(deck, site, at === 0))}
  </ul>
  <footer><a href="${site.repo}">${githubMark}${escape(site.repo.replace(/^https?:\/\/github\.com\//, ''))}</a></footer>
</main>
</body>
</html>
`
}
