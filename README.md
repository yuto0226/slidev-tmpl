# slidev-tmpl

Personal [Slidev](https://sli.dev) themes and the decks built on them, as a pnpm workspace.

There is one theme per speaking occasion, because formality changes the layout and not just the palette.

```text
themes/<occasion>/   theme packages
decks/<name>/        decks, each selecting a theme by relative path
```

## Quick start

```bash
pnpm install
pnpm fonts
pnpm dev
```

```bash
uv sync
uv run pre-commit install
```

`pnpm fonts` downloads and splits the fonts the themes declare; nothing renders correctly until it has run once.
Traditional Chinese prose is linted with `zhtw-mcp`, which must be installed separately and on `PATH`.

## The grid

The canvas is 960 by 540 slide units and a unit is a point.
30 is the largest number that divides both, so a 30pt cell is the only square that tiles the whole slide: 32 columns across, 18 rows down.
Every box is placed and sized in whole cells; the half cell is what text inside a box moves by.

The margin is two cells on every edge, which leaves a content area of 28 by 14 cells.
A content page gives the title the first two rows, one row to the gap, and the remaining eleven to the body.
A cover and a section are the same page ranged differently: a block ten cells tall, six of title over four of text, three cells down from the top rather than centred, because a block on the geometric centre reads as sitting a little low.

Type sizes are multiples of 12 and the line height is 1.25, so every line is a whole number of half cells: 24pt body on one cell, 48pt title on two.
What lands on the grid is the line box.
CSS has no baseline of its own and splits the leading above and below the glyphs, so a baseline sits a little inside its cell, and two sizes on one row share a cell rather than a baseline.

`Shift+R` while the dev server is running cycles a grid over the slide: off, the cells with the lines each box cuts across the slide, then the half cells as well.
The lines are measured from the rendered slide, so a new layout gets them by placing an `h1`, a `.tmpl-body`, or anything carrying `tmpl-box`.

## References

Presentation design has no specification to follow the way the web does, and most of what search returns is template marketing.
These are what this theme is argued from.

- [Material Design](https://m3.material.io/) and IBM Carbon, for grids and type scales that are actually written down.
  The cell and half cell here follow their component-grid and baseline-grid split.
- *Presentation Zen*, Garr Reynolds, on how much one slide should carry.
- *slide:ology*, Nancy Duarte, the one of these that gets concrete about layout and charts.
- *The Non-Designer's Design Book*, Robin Williams, for alignment, contrast, repetition and proximity.
- [Optical versus geometric alignment](https://uiuxatlas.com/lessons/visual-design/optical-vs-geometric-alignment/), which is why the title block sits above centre.
- [CSS Baseline: The Good, The Bad And The Ugly](https://www.smashingmagazine.com/2012/12/css-baseline-the-good-the-bad-and-the-ugly/), on why a baseline grid in CSS aligns line boxes and not baselines.

The golden ratio was tried as a way to place the title and the column split, and dropped.
[Euclid recommended simple rational ratios](https://www.sciencenews.org/?p=26532) for planning buildings and paintings, and there is little evidence that 1.618 carries any aesthetic weight; the simple splits read better here too.

## Status

`themes/original` carries the palette, the type, the grid, five layouts, and the stack and memory diagrams.
`decks/demo` exercises all of them.

See `AGENTS.md` for the font strategy, tooling, and commit conventions.
