# Repository purpose

slidev-tmpl is a pnpm workspace holding personal [Slidev](https://sli.dev) themes and the decks built on them.

A theme exists per speaking occasion.
A reading group wants large type and few words, an academic conference wants citations, footnotes and dense figures.
Those are different layouts rather than one layout with a palette switch, so they are separate packages.

Factor shared layouts into `packages/core` only once a second theme exists and the overlap is visible.

## Principles

- Prefer the smallest change that solves the problem, in code, commits and docs alike.
- A layout is the unit of reuse.
  Two pages that differ only in content share one layout.
- Design tokens live in `styles/`.
  Changing the palette or the type scale must touch one file.
- Diagrams are components fed data as props, not hand-placed boxes.
- Report the exact commands run and their observed results.
  A deck that builds has not been shown to look right.

## Subagents

Delegate to keep the main session small and to run independent tasks in parallel.
The main session owns design decisions and integration, and a subagent returns conclusions rather than file contents.
Every subagent carries an explicit `model`.

Choose the tier from the bottom up and move a task up only when it states a need the tier below cannot meet.
Haiku runs searches, script runs and mechanical edits, sonnet takes scoped implementation, debugging and review, and the default model takes a root cause nobody has located or a design whose trade-offs are real.
Keep a survey's fact-gathering below the judgement made on it, since a cheaper model asked to judge answers confidently and wrongly.

## Grid

The canvas is 960 by 540 slide units and a unit is a point.
A 20-unit cell divides both edges, giving 48 columns across and 27 rows down.
60 and 30 divide them too, and 20 is fine enough to place text on and coarse enough to count.
Boxes are placed in whole cells and text inside a box moves by the half cell.

The margin is three cells on every edge, leaving a content area of 42 by 21 cells.
A page gives the title three rows at the top margin, one row to the gap and seventeen to the body.
A cover and a section are the same page ranged differently, a block fifteen cells tall, nine of title over six of text, four cells down from the top.
A block on the geometric centre reads as sitting a little low.

The grid places boxes rather than text.
Body type is 20px on `--tmpl-body-line` 1.5, so a line is a cell and a half and a box of whole cells holds whole lines only by coincidence.
`--tmpl-heading-line` is 1.25 and applies to headings.
Code is 14px.

A page carrying footnotes lends its body the two rows under the bottom margin and sets the notes at the foot of it, so a long note shortens the content rather than running under it.
Past that the notes run off the page, which `pnpm fit` catches.
Clicking a note's number lights that entry rather than jumping to it, and the next click or step puts it out.

`Shift+R` on the dev server turns the layout guides on and off, and the nav bar's panel chooses which layers they draw.
The lines are measured from the rendered slide, so a new layout gets them by placing an `h1`, a `.tmpl-body`, a `.tmpl-cols` or `.tmpl-rows` child, or anything carrying `tmpl-measure`.
The grid and margin lines are literal whites rather than tokens, because an aid drawn in the theme's palette disappears against a slide using it.

The golden ratio was tried for the title position and the column split, and dropped.
[Euclid recommended simple rational ratios](https://www.sciencenews.org/?p=26532) for planning buildings and paintings, and there is little evidence that 1.618 carries aesthetic weight.

## Themes

`themes/original` is the only theme so far.

### Layouts

Most names Slidev ships are answered here, so a deck written against stock Slidev keeps its shape.
`iframe`, `iframe-left`, `iframe-right`, `none` and `center` are not, and fall through to Slidev's own, which carry no page number.
`PageNumber` is on every layout but `cover`, `section` and `end`.

- `default`, the title band over the body box, and where a slide with no `layout:` lands.
- `cover`, the deck title over `subtitle` from frontmatter, with a bar along the bottom edge.
- `section`, a chapter title with a bar down the left edge.
  Whatever follows the heading is muted.
- `outline`, an agenda written as one ordered list, flowed into two columns that each pack to their own content.
  A section's nested list is set a size down and indented one cell from its number.
- `references`, a bibliography in two columns.
  The entries are set with the footnotes, in `prose.css`.
- `two-cols`, a body split into a left column, a one-cell gutter and the rest.
  The right column takes `::right::`.
- `two-cols-header`, the same split under a shared title band, with `::bottom::` across the foot.
- `two-rows`, two full-width blocks, `::top::` over `::bottom::`, for a comparison whose lines are too long for a column.
- `figure`, a text column of 24 cells with a `::figure::` pane of 16 by 14 on the right.
- `image-left`, `image-right`, `image`, taking `image`, `credit`, `backgroundSize` and `dim`.
  `dim` is the wash that keeps white text readable over a photograph.
- `full`, no title band, the content area is the whole page.
- `statement`, `fact`, `quote`, single-idea pages centred in the content area.
- `intro`, a title band over a lead paragraph set a size up, with an optional `image` drawn as a circular portrait.
- `end`, the closing page, two columns on the middle of the slide with no title band.
  The right column is a `License` card and the Slidev credit, and `license`, `fonts` and `icons` pass through to it.

`left` on the two-column layouts is the left column's width in cells, 20.5 by default, and `auto` sizes it to its content.
`top` on `two-rows` is the top block's height in cells, 8 by default, and takes `auto` the same way.
Both read whatever is written before the first `::marker::` as a band above the blocks.

### Shortcuts

`setup/shortcuts.ts` binds the authoring aids behind `import.meta.env.DEV`.
A combination matches whenever its own keys are down and ignores whatever else is held, which is what a new binding has to work around.

- No bare letter, since Slidev already took `d`, `f`, `g` and `o`.
- No letter Slidev binds with or without `shift`, because its `g` fires on `shift+g` too.
- Exclude `ctrl` and `meta` in the key's own `computed`, or `ctrl+shift+r` cycles the guides on its way to reloading the page.

Anything toggled this way also gets a button in `custom-nav-controls.vue`, which blurs itself so the keyboard keeps working after a click.

### Markdown a body can carry

Slidev registers `markdown-it-github-alerts` and `markdown-it-footnote` itself, so `> [!NOTE]` and `[^1]` work in any deck.
The alert plugin takes its marker list as an option and Slidev passes GitHub's five, so `vite.config.ts` registers it a second time with `markers: '*'` and Phosphor icons.
The plugin inserts its rule after `block` and Slidev calls `markdownSetup` after registering its own copy, so the second rule lands first and converts every blockquote.

Any word is then a callout type, the way Obsidian works.
`prose.css` gives each a `--tmpl-callout` colour that the rule, the label and the wash all read, and a type with no declaration of its own is drawn as a note.
Obsidian's types wear the theme's tokens where one fits.
The maths and note-taking types beyond Obsidian's set outnumber the palette, so they take the rest of Catppuccin Mocha as hex literals.

`vite.config.ts` also registers mark, ins, sup, sub, bracketed-spans and attrs, which is the set Shoka writes with.

| Markup           | Result                                                            |
| ---------------- | ----------------------------------------------------------------- |
| `==text==`       | highlighter                                                       |
| `++text++`       | wavy underline                                                    |
| `~~text~~`       | strikethrough                                                     |
| `[text]{.info}`  | a span, which is the only run attrs has nothing else to attach to |
| `*text*`         | emphasis dots                                                     |
| `2^32^`, `H~2~O` | superscript, subscript                                            |

One class vocabulary covers all of them.
`{.primary}`, `{.info}`, `{.success}`, `{.warning}`, `{.danger}` and `{.muted}` set `--tmpl-pen`, the colour every inline mark is drawn with.
On a span or a strikethrough the pen is the text colour.
`{.solid}` and `{.dotted}` are the underline's other two settings, the wave being the default.
`{.font-display}` through `{.font-caption}` set the type scale's seven steps. attrs attaches a class to a block as well as a run, so a reference table is written `{.font-note}` on the line after it.

The deck's faces carry no italic, so `*emphasis*` takes a dot under each character rather than a slope, because a synthesised oblique shears CJK.
`text-emphasis` would draw those dots but fixes them at half the font size, so they are a background tile one character wide, which assumes the run is CJK.

KaTeX is built into Slidev and needs no setup.
`prose.css` only brings its 1.21em default down, a ratio tuned against Latin body copy.

A thematic break is written `<hr />`, because Prettier normalises `***` and `___` to `---`, which Slidev reads as a slide separator.

## What the theme extends

`themes/original/vite.config.ts` is the only build configuration.
Everything else a deck can do is a Slidev feature or plain CSS.

- `transition: view-transition` on a slide, plus a class on an element of both slides whose CSS sets `view-transition-name`, animates one into the other.
  That is what PowerPoint calls Morph, and `code-morph` in `code.css` is the one the deck uses.
  [Slidev documents the same shape](https://sli.dev/guide/animations) and leaves the CSS to the theme.
  Code that changes between steps is better served by [Shiki Magic Move](https://sli.dev/features/shiki-magic-move), which morphs the tokens themselves.
  `code-gutter` exists so two slides agree on their layout, reserving the breakpoint gutter on a block that morphs into a debug block.
- A code fence takes `{class:'…'}`, which is how a block gets `code-gutter`, `code-debug` or a transition name.
- Icons come from the collections the theme declares, `carbon`, `ph` and `fa6-brands`, written `<ph-arrow-right />` as [the docs do](https://sli.dev/features/icons) or `i-ph:arrow-right` as a class.
  Slidev depends on them itself, but a deck leaning on that would break the day it stopped.
  The generated class carries a size and a mask but no display, so `base.css` makes them inline-block.
- `composables/codeBand.ts` writes `--tmpl-code-band-top` and `--tmpl-code-band-height`, and `code.css` draws one background on the `code` element from them, so a step slides the band between lines rather than redrawing it.
- `slide-top.vue` is the one file a theme gets inside every slide.
  It hosts the code band, the guides overlay and `composables/footnoteHighlight.ts`.
- `waves.ts` is a Vite plugin serving `virtual:tmpl-waves.css`.
  An SVG in `background-image` cannot read a custom property, so it crosses the pens declared in `prose.css` with the palette in `base.css`.
- `vite.config.ts` keeps a fence's info string across `markdown-it-attrs`, which strips the trailing `{…}` Slidev reads a code block's options from, and renders a second citation as `[1]` rather than `[1:1]`.

### Components

- `Banner`, a rotated band across the middle of the slide.
- `Figure`, a picture the slide places itself, taking `src`, `alt` and `credit`.
- `License`, the deck's licences as a card, with the Creative Commons marks its `license` names.
  It takes `by`, `by-sa`, `by-nd`, `by-nc`, `by-nc-sa` and `by-nc-nd` at `version` 4.0, and an unrecognised name falls back to CC BY and warns in dev.
  `fonts` and `icons` are arrays of credit lines, one a line, defaulting to what this theme ships.
  The card is centred, so past about six credits they have outgrown it and belong on a page of their own.
- `PageNumber`, the slide's last cell.
- `StackFrame`, taking `base`, `regions` in memory order, `word`, `maxWords`, `steps`, `sp` and `from-click`.
  A region carries `size`, `label`, `mark`, `overflow` and `pointer`.
  `sp` names the stack-pointer register drawn beside the pushed edge, and a region's `pointer` names one drawn beside its top edge.
  `from-click` is the click the writing reaches the lowest region on, one more per region, and it takes over from each region's `mark`.
  Regions are drawn highest address first and to scale, because how far a buffer reaches is what a frame is usually drawn to show.
  One taller than `maxWords` is cut by a dashed rule stating its byte count.
- `MemoryDump`, taking `base`, `bytes` as whitespace-separated hex, `size`, `writes`, `fill`, `ascii` and `from-click`.
  A write is `{at, size}`, which repeats `fill`, or `{at, bytes}`, where `at` is a byte offset, and `overflow: true` draws it in the danger colour.
  `from-click` is the click of the first write, one more per write.
  An offset past `bytes` renders `??`.
  Sixteen bytes a row, with the gaps a hex viewer puts at the halfway mark and beside each rule.

A picture's credit is the `credit` prop of the image layouts, drawn on the picture's own bottom edge, or `Figure`, which sets it under the picture.
Clicking any picture opens it over the deck on a blurred pane of the slide.
In there the wheel zooms about the pointer up to 8x, a drag moves the picture once it is zoomed, and `Escape`, the backdrop, the close button or the next slide puts it away.
`global-bottom.vue` holds that overlay in Slidev's own menu classes, because it is part of the interface rather than of the slide.

### Code

A fence takes Slidev's own line ranges, and the theme styles what they produce.

````markdown
```cpp {all|3|4-7|9-10}

```
````

Marked lines keep their colour and the rest dim.
The band behind a marked line appears only once some other line has dimmed, so an opening `all` does not tint the whole block.

A second brace group binds props on `CodeBlockWrapper`, which Vue falls through to the rendered block, so a class can switch the whole presentation.

````markdown
```cpp {3|4|5} {class:'code-debug'}

```
````

`code-debug` stops the dimming and tints the stopped line the way a debugger does, because its steps say where execution is rather than what the talk is about.
A line ending in `// [!code bp]` gets a breakpoint dot in the gutter, which `setup/shiki.ts` maps to `code-breakpoint` through `transformerNotationMap`.

### Styles

`styles/index.ts` imports these in order, after the generated `fonts.css` and before the generated `virtual:tmpl-waves.css`.

- `base.css`, the palette, the grid and type tokens, and the `.slidev-layout` frame.
- `code.css`, fenced blocks and the debugger view.
- `diagram.css`, what `StackFrame` and `MemoryDump` share.
- `page.css`, the title band, the body box and its list markers, the `.tmpl-cols` and `.tmpl-rows` grids, the image panes, and where a footnote block sits.
- `prose.css`, the markdown a body carries.

## Layout

- `themes/<name>/` is one theme package.
  - `layouts/` holds page types, one `.vue` per type.
  - `components/` holds reusable pieces used inside slides.
  - `styles/` holds global styles and design tokens.
  - `setup/` holds Slidev build-time configuration.
  - `composables/` holds Vue state a slide reaches for.
  - `lib/` holds pure helpers with no Vue state.
  - `public/` holds static assets.
    Slidev serves a theme's under `/theme/<path-to-theme>/public/`, so the URL embeds the theme's location on disk.
    Keep anything a stylesheet references out of it.
- `decks/<name>/slides.md` is a deck, selecting its theme by relative path.
  Slidev resolves `theme:` as a package name or a relative or absolute path.
- `site/` is the index page that publishes the decks.
- `scripts/` is repository tooling.
  `deck.mjs` runs a deck's own Slidev, `fonts.mjs` builds the fonts, `fit.mjs` measures the rendered slides.

## Fonts

A deck is published as a web page, so every font the theme relies on must be delivered with it.
Setting `fonts.local` only stops Slidev fetching from Google Fonts and does not deliver anything.
A theme that ships every face it uses sets `fonts.provider: none`, which stops the fetch outright.

No font binary is committed.
A theme names the fonts it loads in its own `fonts.toml`, and `scripts/fonts.mjs` downloads each one against a pinned version and checksum, splits it, and writes the chunks into `styles/fonts/`.
That directory is ignored by git, and the raw archives are cached in `.cache/fonts/` so a re-split does not re-download.
Vite resolves the `url()` references and emits content-hashed assets, so no serving path is ever written down.

A font published on [Fontsource](https://fontsource.org) can be an ordinary dependency of the theme package instead, pinned by `pnpm-lock.yaml` and available offline after `pnpm install`.
Prefer that route when it exists.
Nothing currently takes it, because the CJK families below have no package and Fontsource carries no CN edition of Maple Mono.

| Role              | Font                     | Source                                                                    | License |
| ----------------- | ------------------------ | ------------------------------------------------------------------------- | ------- |
| CJK, rounded sans | 源泉圓體 (GenSenRounded) | [ButTaiwan/gensen-font](https://github.com/ButTaiwan/gensen-font)         | OFL-1.1 |
| CJK, serif        | 源雲明體 (GenWanMin)     | [ButTaiwan/genwan-font](https://github.com/ButTaiwan/genwan-font)         | OFL-1.1 |
| CJK, display      | jf open 粉圓             | [justfont/open-huninn-font](https://github.com/justfont/open-huninn-font) | OFL-1.1 |
| Mono              | Maple Mono CN            | [subframe7536/maple-font](https://github.com/subframe7536/maple-font)     | OFL-1.1 |

This is what the repository draws from rather than what every theme loads.
A theme picks its CJK face by occasion, because type carries formality further than colour does and a rounded sans reads informal where a serif reads printed.
Where a serif fits, the preferred face is 源雲明體.

Always fetch the most complete edition a font offers, meaning the widest glyph coverage and the variable build where one exists.
Coverage costs nothing at page weight, because the script splits the font into `unicode-range` chunks with [`cn-font-split`](https://github.com/KonghaYao/cn-font-split) rather than subsetting it.
Every glyph stays available and a browser downloads only the chunks a slide uses.

Weights are the opposite case, because each one multiplies the chunks `dist/` has to carry.
Name the weights a theme loads rather than fetching a whole family.
ExtraLight and Heavy are rarely legible on a projector, and body text wants one step heavier than it would in print.

OFL requires the licence to travel with the font, so the script places it in `styles/fonts/` alongside the chunks.

The ButTaiwan families ship two Traditional Chinese glyph conventions and the choice belongs to the theme.
TW (月版) is the common contemporary Taiwanese stroke forms, such as 者 without the dot, which the upstream project recommends for documents and slides.
TC (丹版) is the traditional letterpress forms, for book typesetting and classical design.

## Build

```bash
pnpm install          # once per clone
pnpm fonts            # once per clone, and whenever fonts.toml changes
pnpm dev [deck]       # dev server; with no deck, original
pnpm build [deck]     # static SPA per deck; with no deck, every one
pnpm fit [deck]       # every slide measured against its boxes
```

`dev`, `build`, `export` and `site` run `pnpm fonts:check` first, which fails when `styles/fonts.css` is missing.

`pnpm export` produces a PDF, and `--format pptx-editable` an editable deck.
It needs `playwright-chromium` in the deck package, which `decks/original` already declares.

Exported `.pptx` is a one-way hand-off format.
Edits made in PowerPoint do not come back, and SVG, canvas, iframes and KaTeX stay as images.

## Site

`.github/workflows/pages.yml` publishes every deck to GitHub Pages on a push to `main`.

```bash
pnpm site          # assembles dist/ for local viewing, base /
pnpm site:serve    # serves dist/ on localhost
pnpm site:index    # rewrites index.html alone, leaving the built decks in place
pnpm site:check    # also runs in the workflow, before the artifact is kept
```

A full build is about 18 seconds a deck, nearly all of it Slidev building and shooting slides.
Rewriting the index alone is about 0.3 seconds whatever the deck count, so iterate with `site:index`.

`site/build.mjs` treats any directory under `decks/` holding a `slides.md` as a deck, builds each to `dist/t/<name>/` and lists it on the generated `dist/index.html`.
`page.mjs` holds the markup, `index.css` and `rail.css` the stylesheets, `rail.js` the one script, `fonts.mjs` the faces.
A stylesheet kept as a JavaScript template string has no formatter and no highlighting, so these are read from disk at build time and inlined.

A Slidev SPA bakes its base path into asset URLs at build time, so `--base` has to be given and the workflow passes the repository name.
Git Bash rewrites a leading-slash argument into a Windows path, so pass the name bare locally and the script adds the slashes.
The workflow also passes `--origin` for the Open Graph tags and `--repo` for the footer link.

Decks build with `--router-mode hash` because Pages serves static files with no SPA fallback, and a reload on `/t/<name>/5` would otherwise reach the server as a path that does not exist.

A deck's `preview` headmatter names the slides that represent it on the index, the first in the construction box.

```yaml
preview: [1, 3, 7, 9]
```

Thumbnails are rendered through `playwright-chromium`, which the deck package already declares.

Every number on the page is read from the theme it describes.
The cell and type sizes come out of `base.css`, the faces and canvas out of `package.json`, the layouts out of the directory, the slide count through `@slidev/parser`.
Nothing there is typed by hand, so the index cannot drift from the theme.

`site/fonts.mjs` names the theme whose split chunks are copied, the chunk directory, and the family the stylesheets ask for.
The build declares `--sans` and `--mono` on the page, so a stylesheet never spells a face and a face that was not shipped cannot be asked for.
A deck's text is fixed once it is built, so `narrowDeckFonts` drops the chunks and `@font-face` rules whose `unicode-range` covers nothing the deck sets, and preloads the ones it keeps.
The index does the same for itself, which is why the page is rendered before its fonts are copied.

`site/check.mjs` checks mechanical facts and nothing else.
Every custom property the stylesheets read is declared and every one declared is read, every file `page.mjs` inlines is tracked by git, every local URL the page names is on disk, no `undefined`, `NaN` or `[object Object]` reached the page, the fonts the page asks for were shipped with their licences, and every CJK character a deck sets is covered by a chunk the build kept.
It does not open a browser and does not check that the page looks right.
That line is worth holding, because both defects it was written for were static facts that no amount of looking at the page would have shown.

## Repository tooling

Run `uv sync`, then `uv run pre-commit install` once per clone, which installs both the pre-commit and commit-msg hooks.
`pre-commit` checks only tracked files, so stage new files before `uv run pre-commit run --all-files`.

`pnpm lint` runs ESLint over the `.vue` and `.mjs` files and `pnpm typecheck` runs `tsc --noEmit` over the `.ts` files, with no overlap between them.

rumdl runs on prose Markdown only, never on a deck.
It reflows prose sentence-per-line and rejects repeated top-level headings, and a deck needs both, because Slidev gives every slide its own `#` heading and separates slides with `---` frontmatter blocks.

Do not commit `docs/` unless the user explicitly approves it.
Do not commit `node_modules/`, `dist/`, or export output.

### Traditional Chinese

Chinese prose in the deck and in `docs/` is checked with `zhtw-mcp`, installed separately and expected on `PATH`.
It catches cross-strait vocabulary (內存 → 記憶體, 緩存 → 快取), AI filler, and translationese.

```bash
pnpm zhtw                                                      # every deck
zhtw-mcp lint --content-type markdown docs/some-note.md        # prose outside a deck
```

`--content-type markdown` skips fenced code blocks, so identifiers and output samples are left alone.

A deck goes through `scripts/zhtw.mjs`, which sends the slide bodies alone because the linter reads frontmatter as prose, and keeps the colon rule off because `::name::` marks a slot.
Only the mechanical families fail the hook, listed in the script.
The rest judge the writing and can be wrong, so they print and the writer decides.

## Commits

### Granularity

- One logical change per commit, justifiable on its own.
  Split when the subject needs "and", and combine when a commit only makes sense together with the next one.
- Amend rather than stacking a corrective commit on top, because history records decisions rather than the path taken to reach them.
  Open a separate commit only when the mistake is worth reading later, meaning one that shipped, that someone else built on, or whose reasoning explains a constraint that still holds.
- Every commit passes `pnpm build`, so `git bisect` works.
- Changes to existing code get one commit per type.
  `fix`, `perf`, `refactor`, `feat` and `style` never share a commit.
  A refactor must not change behaviour, and is committed before the change it enables.

### Messages

- Use `type(scope): subject`.
  Scopes are the theme, deck or area (`original`, `demo`, `layout`, `component`, `font`, `tooling`), omitted for changes spanning the whole repository.
- Allowed types are `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `build`, `perf` and `style`.
- The subject is a lowercase imperative phrase with no trailing punctuation, and the header is at most 72 characters.
- Separate an optional body from the header with a blank line and wrap it at 72 characters.
  Use it for context, what changed and why, rather than narrating the diff file by file.
- Standalone URLs and machine-readable footers may exceed 72 characters.
- Do not add AI co-author signatures or session trailers.

The `commit-msg` hook checks the header mechanically through `scripts/check_commit_msg.py`.
The body guidance is not machine-checked.

## Writing conventions

These rules hold for every file in the repository, code, comments, configuration, commit messages and documentation alike.
A comment in a TOML manifest is held to the same standard as one in a Vue component.

- Be concise and direct.
  Say it once, and omit what the context already makes clear.
- Raise information density by cutting what carries none, never by abbreviating what does.
  Shortening a name or a sentence past the point where it states the thing precisely moves the work to the reader.
- Prefer plain wording, keeping precise English technical terms where a translation would be less clear.
- Remove mannered prose and decorative adverbs.
- Keep conversation-specific context out of the repository.
- A log line names what failed and which input caused it, so a reader can find the code without rereading the script.

### English

- `,` comma, with the Oxford comma before the last item in a list
- `;` semicolon, joining two independent sentences, and never used to bolt a second thought onto a finished one
- `:` colon, introducing a list.
  A statement and its gloss is two half-statements, so write one sentence
- Curly quotes `" " ' '`, not straight quotes
- En dash `–` for ranges (`2020–2023`).
  No em dash.
  An aside is a sentence of its own, a comma, or parentheses
- `…` ellipsis as a single glyph, not three periods

### Chinese (繁體中文)

- `，` comma, for a pause within a sentence; `、` enumeration comma, between parallel items
- `。` full stop, ends a statement
- `；` semicolon, joins two closely related independent clauses
- `：` colon, introduces a list or quote，不用來接解釋
- `「」` quotes (primary), `『』` for a quote nested inside another quote
- 不使用 `——`，補充就另起一句或用逗號
- `……` ellipsis, the two-character glyph, not three periods
- `《》` title marks, for book or work titles
- 禁止使用無意義的、裝飾性的狀語或補語

**Mixed Chinese/English (盤古之白):** insert a half-width space between CJK characters and adjacent Latin letters or digits in prose, e.g. `使用 Slidev 建置簡報`.
Applies to prose and comments, not to identifiers or URLs.

### Naming

- Layout files are named after the page type they provide, in kebab-case, omitting context the location already gives.
- Components use PascalCase file names and are referenced by that name in the deck.
- `tmpl-` marks what a deck can rely on, so it goes on the structural classes and on `base.css`'s custom properties.
  A class or property living inside one component takes that component's own word instead, as `stack-row` and `license-head` do.
- `base.css` holds colour roles, so a colour only one feature can show lives with that feature.
- Prefer the plain, direct English word, and drop a verb the location already implies.
- Names in one family share their word and their unit, and a suffix carrying two kinds of value is a defect.
- A name that reads as one thing and holds another is the defect worth fixing.
  A short name whose meaning is plain in its own file is not.

### Comments

No comment is the default.
Review every comment by asking why a comment needs to be here, and delete it when that cannot be answered in one sentence.

Keep a comment only for what the code cannot say.
A framework, browser or library quirk the code works around, where a magic number came from, a constraint that makes the obvious alternative wrong, or a dependency on another file a reader could not discover locally.
Cut what survives to the shortest form that still carries the reason.

- Delete a comment that restates the code beside it, that argues for a design preference the declaration already carries, or that stopped being true when the code changed.
- A long comment is earned only where the subject is hard, meaning hardware, mathematics or a protocol.
  In a stylesheet or a component it means the code or the naming is wrong, so fix those instead.
- Write a comment as a plain sentence, without stating a label and then glossing it.
- Name the thing a comment describes rather than a document that describes it, because documents get renamed and the reason belongs in the comment.
- Link the Slidev documentation page when a comment justifies framework behaviour.

### Documentation

- Record what the code cannot show, meaning constraints, upstream quirks and decisions whose alternatives were rejected.
  Leave what the code states to the code.
- Keep it dense, merge overlapping concepts, and do not end with a summary that restates the document.
- Use independent, unnumbered H2 sections unless the material has an intrinsic sequence.
- Verify the relevant section of a source before citing it, and link it directly.
