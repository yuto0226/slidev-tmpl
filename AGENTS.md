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

## Themes

`themes/original` is the only theme so far.

### Layouts

- `cover`: the deck title over `subtitle` from frontmatter, centred, with a rule along the bottom edge.
- `section`: a chapter title with a bar down the left edge, ranged left; whatever follows the heading is muted.
- `content`: the title band over the body box.
- `two-cols`: a content page whose body splits into 13 cells, a two-cell gutter, and 13 cells.
  The right column takes the `::right::` slot.

### Components

- `Banner`: a rotated band across the middle of the slide.
- `PageNumber`: the slide's last cell, placed by `content` and `two-cols`.
- `StackFrame`: `base`, `regions` in memory order (`size`, `label`, `mark`), `word` (4), `maxWords` (4), `steps`.
  Regions are drawn highest address first and to scale, because how far a buffer reaches is what a frame is usually drawn to show.
  One taller than `maxWords` is cut by a dashed rule that states its byte count instead.
  `steps` fills the regions one click at a time, in push order.
- `MemoryDump`: `base`, `bytes` as whitespace-separated hex, `mark` as a half-open offset range, `ascii`.
  Sixteen bytes a row, with the gaps a hex viewer puts at the halfway mark and beside each rule.

### Code

A fence takes Slidev's own line ranges, and the theme styles what they produce.

````markdown
```cpp {all|3|4-7|9-10}

```
````

Marked lines keep their colour and the rest dim.
The band behind a marked line appears only once some other line has dimmed, so an opening `all` does not tint the whole block.

A second brace group binds props on `CodeBlockWrapper`, which Vue falls through to the rendered block, so a class can switch the whole presentation:

````markdown
```cpp {3|4|5} {class:'code-debug'}

```
````

`code-debug` stops the dimming and tints the stopped line the way a debugger does, because its steps say where execution is rather than what the talk is about.
A line ending in `// [!code bp]` gets a breakpoint dot in the gutter; `setup/shiki.ts` maps that notation to `code-breakpoint` through `transformerNotationMap`.

### Styles

`styles/index.ts` imports these in order, after the generated `fonts.css`.

- `base.css`: the palette, the grid and type tokens, and the `.slidev-layout` frame.
- `code.css`: fenced blocks and the debugger view.
- `diagram.css`: what `StackFrame` and `MemoryDump` share.
- `page.css`: the title band, the body box, and the list markers inside it.

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

| Role              | Font                     | Source                                                                    | License |
| ----------------- | ------------------------ | ------------------------------------------------------------------------- | ------- |
| CJK, rounded sans | 源泉圓體 (GenSenRounded) | [ButTaiwan/gensen-font](https://github.com/ButTaiwan/gensen-font)         | OFL-1.1 |
| CJK, serif        | 源雲明體 (GenWanMin)     | [ButTaiwan/genwan-font](https://github.com/ButTaiwan/genwan-font)         | OFL-1.1 |
| CJK, display      | jf open 粉圓             | [justfont/open-huninn-font](https://github.com/justfont/open-huninn-font) | OFL-1.1 |
| Mono              | Maple Mono CN            | [subframe7536/maple-font](https://github.com/subframe7536/maple-font)     | OFL-1.1 |

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
pnpm build                        # static SPA into decks/original/dist/
pnpm --filter deck-<name> build   # any other deck
```

`pnpm export` produces a PDF, and `--format pptx-editable` an editable deck.
It needs `playwright-chromium` in the deck package, which `decks/original` already declares.

Exported `.pptx` is a one-way hand-off format.
Edits made in PowerPoint do not come back, and SVG, canvas, iframes, and KaTeX stay as images.

## Site

`.github/workflows/pages.yml` publishes every deck to GitHub Pages on a push to `main`.

```bash
pnpm site          # assembles dist/ for local viewing, base /
pnpm site:serve    # serves site/ on localhost
pnpm site:index    # rewrites index.html alone, leaving the built decks in place
```

A full build is about 18 seconds a deck, nearly all of it Slidev building the deck and shooting its slides; rewriting the index alone is about 0.3 seconds whatever the deck count.
Iterate on the page with `site:index` and reload.
Pass `--base slidev-tmpl` to reproduce exactly what the workflow builds.

`site/` is the index: a front-end project, kept as one rather than as tooling.
`page.mjs` holds the markup, `index.css` and `rail.css` the stylesheets, `rail.js` the one script the page carries, `fonts.mjs` the faces it sets.
A stylesheet kept as a JavaScript template string has no formatter, no highlighting and an escaping hazard every time it is edited; these are read from disk at build time and inlined.
`site/build.mjs` builds it (flags, deck discovery, the per-deck Slidev calls, the font copy) and `site/check.mjs` checks it.
The built site is `dist/`, which is why the project that builds it can have the name `site/`.

`site/build.mjs` treats any directory under `decks/` holding a `slides.md` as a deck.
Each one is built to `dist/t/<name>/` and listed on the generated `dist/index.html`.

A Slidev SPA bakes its base path into asset URLs at build time, so `--base` has to be given; the workflow passes the repository name.
Git Bash rewrites a leading-slash argument into a Windows path, so pass the name bare locally, and the script adds the slashes.

Decks build with `--router-mode hash` because Pages serves static files with no SPA fallback, and a reload on `/t/<name>/5` would otherwise reach the server as a path that does not exist.

A deck's `preview` headmatter names the slides that represent it on the index, first one large:

```yaml
preview: [1, 3, 7, 9]
```

Thumbnails are rendered through `playwright-chromium`, which the deck package already declares.

The index is the themes' guide overlay left switched on: it runs on the same 30px cell and draws it.
A theme's name and description come before its slides and the spec list after, so a heading always precedes what it names.
With one theme the order is a preference; with six it is the difference between a labelled entry and four unidentified pictures.
The four slides are peers at one size in a 2x2 grid, each with the same offset hatched shadow.
Every theme's cover stands in a construction box: a dashed frame one cell clear of the slide, with scales along its top and left edges dividing it into that deck's own columns and rows rather than into page cells, and the canvas measured along the other two.
The numbers are that theme's, so the frame measures something different each time rather than repeating one fact.
Hovering the cover turns one value: the slide is drawn larger inside its frame, the scales open out by the same factor, and the measures read what is on screen rather than what the file is.
It states the format once for the page; repeated under every theme it would annotate nothing.
Below 40rem the grid becomes one column and the construction box is hidden.

With more than one theme the page grows a rule of its own: a tick a theme, standing in the margin above 78rem and lying under the header below it, where there is no margin to stand in.
Every tick ends on one line, and the tick of the theme you are reading is longer and darker.
That is the only thing on the page that needs a script, a short observer that sets `aria-current`.
One theme has nothing to navigate, so none of it, including its stylesheet and its script, reaches the page.

```bash
pnpm site:check    # also runs in the workflow, before the artifact is kept
```

`site/check.mjs` checks mechanical facts and nothing else: that every custom property the stylesheets read is declared somewhere, that every file `page.mjs` inlines is tracked by git, that every local URL the page names is on disk, and that no `undefined` reached the page.
It does not open a browser and does not check that the page looks right or behaves.
That is read on the page.
The line is worth holding: both defects it was written for were static facts that no amount of looking at the page would have shown.

Every number on the page is read from the theme it describes: the cell and type sizes out of `base.css`, the faces and canvas out of `package.json`, the layouts out of the directory, the slide count through `@slidev/parser`.
Nothing there is typed by hand, so the index cannot drift from the theme.

The page sets GenSenRounded TW and Maple Mono CN, copied into `dist/fonts/`.
`site/fonts.mjs` is where that is decided, and one entry names all three things it takes: the theme whose split chunks are copied, the chunk directory, and the family the stylesheets ask for.
The build copies by slug from the named theme and declares `--sans` and `--mono` on the page, so the stylesheets never spell a face and a face that was not shipped cannot be asked for.
A deck ships every chunk of a split CJK face because its text is whatever the author writes next; the index's text is fixed once it is built, so `copyFonts` keeps only the chunks and `@font-face` rules whose `unicode-range` covers a character the page actually sets.
The page is therefore rendered before the fonts are copied.

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
zhtw-mcp lint --content-type markdown decks/original/slides.md
zhtw-mcp lint --content-type markdown --fix decks/original/slides.md
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
