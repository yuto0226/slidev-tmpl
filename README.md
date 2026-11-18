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

## Shortcuts

The theme adds one, and only under `pnpm dev`.

| Key       | Effect                                                                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shift+r` | shows or hides the layout guides, as the ruler button in the bottom bar does. Which layers show is chosen in that button's panel and is remembered. |

Slidev's own, the ones worth having to hand while presenting.

| Key                | Effect                                     |
| ------------------ | ------------------------------------------ |
| `space`, `→`       | next step                                  |
| `shift+space`, `←` | previous step                              |
| `↓`, `shift+→`     | next slide, skipping the steps it has left |
| `↑`, `shift+←`     | previous slide                             |
| `g`                | go to a slide by number                    |
| `o`, `` ` ``       | overview of every slide                    |
| `esc`              | leave the overview                         |
| `d`                | light or dark                              |
| `f`                | fullscreen                                 |

## References

Two sources behind the grid and the type, both read.

- [CSS Baseline: The Good, The Bad And The Ugly](https://www.smashingmagazine.com/2012/12/css-baseline-the-good-the-bad-and-the-ugly/), Espen Brunborg, 2012.
  CSS has no concept of a baseline and sets glyphs near the middle of the line box, which is why the grid aligns line boxes and a baseline sits a little inside its cell.
- [Optical versus geometric alignment](https://uiuxatlas.com/lessons/visual-design/optical-vs-geometric-alignment/), on why a line of text on its geometric centre reads as low.
  The cover and section blocks sit three cells down rather than centred, which takes the same idea from a line to a block.

## Judging the talk

A theme cannot make a talk good.
These are the tests worth running once a deck exists, cheapest first.
Each is a heuristic with the standing noted, not a finding.

- Read only the `h1` of every slide, in order.
  They should carry the argument on their own, and one that names a topic instead of making a claim is a slide that has not decided what it says.
  From the assertion-evidence form, Michael Alley and Kathryn Neeley, _Rethinking the Design of Presentation Slides_, Technical Communication 52(4), 2005, [assertion-evidence.com](https://www.assertion-evidence.com/).
  One course study supports it and a later replication did not.
- Say the whole talk as one sentence shaped `A, but B, therefore C`.
  A talk that only takes `and` has no turn in it and is a list.
  Randy Olson, _Houston, We Have a Narrative_, University of Chicago Press, 2015.
  The form is Trey Parker's, and the claim that every story reduces to it is asserted rather than shown.
- Mark each slide as the world as it is or the world as it could be.
  Duarte's reading of famous speeches is that they alternate and close on the second, so a deck that never leaves what is reads as a status report.
  [The secret structure of great talks](https://www.ted.com/talks/nancy_duarte_the_secret_structure_of_great_talks), TEDxEast, 2011, drawn from a handful of speeches.
- Check that each group of points answers the question the point above it raises.
  Barbara Minto, _The Pyramid Principle_, 1985.
  MECE, no overlap and no gaps, tests only that a split is clean, never that it answers anything.
- Cut whatever the argument does not need.
  Coherence is the best supported of Mayer's principles, favoured by 23 of 23 experiments at a median effect size of 0.86.
  Mayer and Fiorella, chapter 12 of _The Cambridge Handbook of Multimedia Learning_, Cambridge University Press, 2014, [doi:10.1017/CBO9781139547369.015](https://doi.org/10.1017/CBO9781139547369.015).
  Measured on short narrated lessons with students, so a live talk is an extension of it.
