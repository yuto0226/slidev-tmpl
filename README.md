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

## References

Presentation design has no specification the way the web does, and most of what search returns is template marketing.
The layouts follow these sources.

- [Material Design](https://m3.material.io/) and IBM Carbon, for grids and type scales that are written down.
  The cell and half cell follow their component-grid and baseline-grid split.
- _Presentation Zen_, Garr Reynolds, on how much one slide should carry.
- _slide:ology_, Nancy Duarte, covers layout and charts concretely.
- _The Non-Designer's Design Book_, Robin Williams, for alignment, contrast, repetition and proximity.
- [Optical versus geometric alignment](https://uiuxatlas.com/lessons/visual-design/optical-vs-geometric-alignment/), explains why a title block sits above centre.
- [CSS Baseline: The Good, The Bad And The Ugly](https://www.smashingmagazine.com/2012/12/css-baseline-the-good-the-bad-and-the-ugly/), explains why a baseline grid in CSS aligns line boxes and not baselines.

See `AGENTS.md` for the grid, the font strategy, tooling, and commit conventions.
