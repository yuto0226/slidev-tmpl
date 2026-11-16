# Repository purpose

slidev-tmpl is a pnpm workspace holding personal [Slidev](https://sli.dev) themes and the decks built on them.

A theme exists per speaking occasion, because formality changes more than the palette.
A reading group wants large type and few words; an academic conference wants citations, footnotes, and dense figures.
Those are different layouts, not one layout with a palette switch, so they are separate packages.

Factor shared layouts into `packages/core` only once a second theme exists and the overlap is visible.
Do not create the abstraction in advance.

## Principles

- Prefer the smallest, most direct change that solves the problem, in code, commits, and docs alike.
- A layout is the unit of reuse.
  When two pages differ only in content, they share one layout; do not copy a layout to vary one value.
- Design tokens live in `styles/`, not in individual layouts.
  Changing the palette or the type scale must touch one file.
- Diagrams are components that take data as props, not hand-placed boxes.
  A stack frame or a memory dump is drawn once and fed different data.
- Report the exact commands run and their observed results.
  Never fabricate build or render results; a deck that builds has not been shown to look right.

## Subagents

Delegate to subagents to save tokens, keep the main session small, and run independent tasks in parallel.
The main session owns design decisions and integration; subagents return conclusions, not file contents.

- Haiku: searches, lookups, version checks, and mechanical edits that involve no design decisions.
- Sonnet: scoped implementation, debugging, and review.
  Use Sonnet when unsure.
- Launch independent tasks in parallel.
  Give each a self-contained prompt stating the files, constraints, and expected output.

## Grid

The canvas is 960 by 540 slide units and a unit is a point.
30 is the largest number that divides both, so a 30pt cell is the only square that tiles the whole slide: 32 columns across, 18 rows down.
Every box is placed and sized in whole cells; the half cell is what text inside a box moves by.

The margin is two cells on every edge, which leaves a content area of 28 by 14 cells.
A content page gives the title the first two rows, one row to the gap, and the remaining eleven to the body.
A cover and a section are the same page ranged differently: a block ten cells tall, six of title over four of text, three cells down from the top rather than centred, because a block on the geometric centre reads as sitting a little low.

Type sizes are multiples of 12 and the line height is 1.25, so every line is a whole number of half cells: 24pt body on one cell, 48pt title on two.
What lands on the grid is the line box.
CSS has no baseline of its own and splits the leading above and below the glyphs, so a baseline sits a little inside its cell, and two sizes on one row share a cell rather than a baseline.

`Shift+R` on the dev server cycles a grid over the slide: off, the cells with the lines each box cuts across the slide, then the half cells as well.
The lines are measured from the rendered slide, so a new layout gets them by placing an `h1`, a `.tmpl-body`, or anything carrying `tmpl-box`.
The margin is drawn in its own colour, and the overlay's colours are literals rather than tokens, because an aid in the theme's palette disappears against a slide using it.

The golden ratio was tried for the title position and the column split, and dropped.
[Euclid recommended simple rational ratios](https://www.sciencenews.org/?p=26532) for planning buildings and paintings, and there is little evidence that 1.618 carries aesthetic weight; the simple splits read better here too.

## Layout

- `themes/<name>/`: one theme package.
  - `layouts/`: page types, one `.vue` per type.
  - `components/`: reusable pieces used inside slides, such as diagrams that take data as props.
  - `styles/`: global styles and design tokens.
  - `setup/`: Slidev build-time configuration, such as `shiki.ts` for code highlighting.
  - `public/`: static assets.
    Slidev serves a theme's under `/theme/<path-to-theme>/public/`, so the URL embeds the theme's location on disk; keep anything a stylesheet references out of here.
- `decks/<name>/slides.md`: a deck, selecting its theme by relative path.
  Slidev resolves `theme:` as a package name or a relative or absolute path.
- `scripts/`: repository tooling.

## Fonts

The deck is published as a web page, so viewers do not have the local fonts installed.
Every font the theme relies on must be delivered with the page.
Setting `fonts.local` in a deck only stops Slidev from fetching a font from Google Fonts; it does not deliver that font to a viewer.
A theme that ships every face it uses sets `fonts.provider: none` instead, which stops the fetch outright.

No font binary is committed.
A theme names the fonts it loads in its own `fonts.toml`, and `scripts/fetch-fonts.mjs` downloads each one against a pinned version and checksum, splits it, and writes the chunks into the theme's `styles/fonts/`.
That directory is ignored by git, and the raw archives are cached in `.cache/fonts/` at the repository root so a re-split does not re-download.

The output is a stylesheet next to its `.woff2` files, which `styles/index.ts` imports.
Vite resolves the `url()` references and emits content-hashed assets, so no serving path is ever written down.

A font published on [Fontsource](https://fontsource.org) can be an ordinary dependency of the theme package instead, pinned by `pnpm-lock.yaml` and available offline after `pnpm install`.
Prefer that route when it exists.
Nothing currently takes it: the CJK families below have no package, and Fontsource carries no CN edition of Maple Mono.

| Role | Font | Source | License |
| --- | --- | --- | --- |
| CJK, rounded sans | 源泉圓體 (GenSenRounded) | [ButTaiwan/gensen-font](https://github.com/ButTaiwan/gensen-font) | OFL-1.1 |
| CJK, serif | 源雲明體 (GenWanMin) | [ButTaiwan/genwan-font](https://github.com/ButTaiwan/genwan-font) | OFL-1.1 |
| CJK, display | jf open 粉圓 | [justfont/open-huninn-font](https://github.com/justfont/open-huninn-font) | OFL-1.1 |
| Mono | Maple Mono CN | [subframe7536/maple-font](https://github.com/subframe7536/maple-font) | OFL-1.1 |

This is what the repository draws from, not what every theme loads.
A theme picks its CJK face by occasion.
Type carries formality further than color does, and a rounded sans reads informal where a serif reads printed and formal.
Where a serif fits, the preferred face is 源雲明體.

Always fetch the most complete edition a font offers, meaning the widest glyph coverage and the variable build where one exists.
Coverage costs nothing at page weight, because the script splits the font into `unicode-range` chunks with [`cn-font-split`](https://github.com/KonghaYao/cn-font-split) rather than subsetting it.
Every glyph stays available and a browser downloads only the chunks a slide uses.
A missing glyph is a silent fallback to the viewer's system font; a chunk never fetched costs nothing.

Weights are the opposite case, because each one multiplies the chunks `dist/` has to carry.
Name the weights a theme loads; do not fetch a whole family.
ExtraLight and Heavy are rarely legible on a projector, and body text wants one step heavier than it would in print.

OFL requires the license to travel with the font, so the script places it in `styles/fonts/` alongside the chunks.

The ButTaiwan families ship two Traditional Chinese glyph conventions, and the choice belongs to the theme:

- **TW (月版)**: the common contemporary Taiwanese stroke forms, such as 者 without the dot.
  The upstream project recommends it for documents and slides.
- **TC (丹版)**: traditional letterpress forms, for book typesetting and classical design.

## Build

```bash
pnpm install                      # once per clone
pnpm dev                          # dev server for the demo deck
pnpm build                        # static SPA into decks/demo/dist/
pnpm --filter deck-<name> build   # any other deck
```

`pnpm export` produces a PDF, and `--format pptx-editable` an editable deck.
It needs `playwright-chromium` in the deck package, which `decks/demo` already declares.

Exported `.pptx` is a one-way hand-off format.
Edits made in PowerPoint do not come back, and SVG, canvas, iframes, and KaTeX stay as images.

## Repository tooling

Run `uv sync`, then `uv run pre-commit install` once per clone; this installs both the pre-commit and commit-msg hooks.
`pre-commit` checks only tracked files, so stage new files before `uv run pre-commit run --all-files`.

rumdl runs on prose Markdown only, never on a deck.
It reflows prose sentence-per-line and rejects repeated top-level headings, and a deck needs both: Slidev gives every slide its own `#` heading and separates slides with `---` frontmatter blocks.

Do not commit `docs/` unless the user explicitly approves it.
Do not commit `node_modules/`, `dist/`, or export output.

### Traditional Chinese

Chinese prose in the deck and in `docs/` is checked with `zhtw-mcp`, installed separately and expected on `PATH`.
It catches cross-strait vocabulary (內存 → 記憶體, 緩存 → 快取), AI filler, and translationese.

```bash
zhtw-mcp lint --content-type markdown decks/demo/slides.md
zhtw-mcp lint --content-type markdown --fix decks/demo/slides.md
```

`--content-type markdown` skips fenced code blocks, so identifiers and output samples are left alone.
The hook gates on `--max-warnings 0`; a plain `lint` exits 0 even when it reports warnings.

A deck runs with the colon rule off, because Slidev marks a named slot with `::name::` and the rule reads that as a Chinese sentence missing its full-width colon.

Suppress a false positive in a `.zhtw-mcp.toml` at the repository root rather than rewording a term that is correct in context.

## Commits

### Granularity

- One logical change per commit, justifiable on its own.
  Split when the subject needs "and" or the body describes several changes; combine when a commit only makes sense together with the next one.
- Amend rather than stacking a corrective commit on top.
  History records decisions, not the path taken to reach them.
  Open a separate commit only when the mistake is worth reading later: one that shipped, that someone else built on, or whose reasoning explains a constraint that still holds.
- Every commit passes `pnpm build`, so `git bisect` works.
- Changes to existing code get one commit per type: `fix`, `perf`, `refactor`, `feat`, and `style` never share a commit.
  A refactor must not change behavior; commit it before the change it enables.

### Messages

- Use `type(scope): subject`.
  Scopes are the theme, deck, or area (`original`, `demo`, `layout`, `component`, `font`, `tooling`); omit the scope for changes that span components or the whole repository.
- Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `build`, `perf`, `style`.
- Subject: lowercase imperative phrase, no trailing punctuation.
  The header must not exceed 72 characters.
- Separate an optional body from the header with a blank line.
- Use the body for context, what changed, and why.
  Do not narrate the diff file by file.
  Wrap body text at 72 characters.
- Standalone URLs and machine-readable footers may exceed 72 characters.
- Do not add AI co-author signatures or session trailers.

The header format is checked mechanically by the `commit-msg` hook (`scripts/check_commit_msg.py`); the body guidance is not machine-checked.

## Writing conventions

These rules hold for every file in the repository: code, comments, configuration, commit messages, and documentation alike.
A comment in a TOML manifest is held to the same standard as one in a Vue component.
Remove all mannered prose: no meaningless, decorative adverbs or complements.

- Be concise and direct.
  Say it once; omit what the context already makes clear.
- Raise information density by cutting what carries none, never by abbreviating what does.
  Shortening a name or a sentence past the point where it states the thing precisely moves the work to the reader.
- Prefer plain wording.
  Keep precise, searchable English technical terms where a translation would be less clear.
- Keep conversation-specific context out of the repository.
- A log line names what failed and which input caused it, so a reader can find the code without rereading the script.

### English

- `,` comma (Oxford comma before the last item in a list), `.` period
- `;` semicolon, joins two independent sentences
- `:` colon, introduces a list or explanation
- Curly quotes `" " ' '`, not straight quotes
- En dash `–` for ranges (`2020–2023`); em dash `—` for an aside (no surrounding spaces), used sparingly, not as a default connector
- `…` ellipsis as a single glyph, not three periods

### Chinese (繁體中文)

- `，` comma, for a pause within a sentence; `、` enumeration comma, between parallel items (not `，`)
- `。` full stop, ends a statement
- `；` semicolon, joins two closely related independent clauses
- `：` colon, introduces a list, explanation, or quote
- `「」` quotes (primary), `『』` for a quote nested inside another quote
- `——` em dash, for an aside or elaboration; use sparingly
- `……` ellipsis, the two-character glyph (six dots), not three periods
- `《》` title marks, for book or work titles
- 禁止使用無意義的、裝飾性的狀語或補語

**Mixed Chinese/English (盤古之白):** insert a half-width space between CJK characters and adjacent Latin letters or digits in prose, e.g. `使用 Slidev 建置簡報`, `v53.1.0 版本`.
Applies to prose and comments, not to identifiers or URLs.

### Naming

- Layout files are named after the page type they provide (`cover.vue`, `section.vue`, `code.vue`), in kebab-case; omit context the location already gives.
- Components use PascalCase file names and are referenced by that name in the deck.
- CSS custom properties carry a theme prefix, e.g. `--tmpl-accent`.

### Comments

- A comment and the code under it complement each other, and neither repeats the other.
  Code states what happens; a comment states why, what must hold, and what would otherwise look like a mistake.
- Delete a comment the code already makes obvious.
  A reader who stops trusting comments to carry new information stops reading them.
- Write a comment as a plain sentence.
  Do not state a label and then gloss it (`title: desc`) unless that form carries the point more exactly than a sentence would.
- A comment does not name a document.
  Documents get renamed and reorganised; the reason belongs in the comment itself.
- Link the Slidev documentation page when a comment justifies framework behavior.

### Documentation

- Keep information dense.
  Merge overlapping concepts; do not end with a summary that restates the document.
- Use independent, unnumbered H2 sections unless the material has an intrinsic sequence.
- Verify the relevant section of a source before citing it, and link it directly.
