# @yuto0226/flourish

A dark [Slidev](https://sli.dev) theme for teaching and conference talks on security and systems.

A slide is a 960x540 canvas laid out on a 20px cell, 48 cells across and 27 down. Titles, bodies
and page numbers all land on that grid. The surface stays plain. What carries the reading is the
marks made on it: a band behind the highlighted lines of code, a wavy underline, emphasis dots
beside CJK text, a footnote that lights up when its reference is clicked.

## Use

```yaml
---
theme: '@yuto0226/flourish'
---
```

Slidev offers to install the theme the first time it reads that line.

## Layouts

| Layout                                    | For                                   |
| ----------------------------------------- | ------------------------------------- |
| `cover`                                   | the title slide                       |
| `intro`                                   | who is speaking, with a portrait      |
| `section`                                 | a divider that names what follows     |
| `default`                                 | a title and a body                    |
| `two-cols`, `two-cols-header`, `two-rows` | a slide split into named slots        |
| `fact`, `statement`, `quote`              | one number, one sentence, a quotation |
| `image`, `image-left`, `image-right`      | a picture, bled or beside the text    |
| `figure`                                  | a picture with a caption and a credit |
| `full`                                    | the body with no title                |
| `outline`, `references`                   | an agenda, a bibliography             |
| `end`                                     | the closing slide                     |

## Components

| Component    | Draws                                                 |
| ------------ | ----------------------------------------------------- |
| `MemoryDump` | a hex dump whose writes land click by click           |
| `StackFrame` | a stack that fills as the writing reaches each region |
| `Figure`     | a picture with a credit line, opening into a lightbox |
| `License`    | a Creative Commons card                               |
| `Banner`     | a strip across the slide                              |
| `PageNumber` | the page number, a cell inside the corner             |

Code blocks take Shiki's `{1,3-5}` line ranges, and `// [!code bp]` marks a breakpoint. Markdown
gains `==mark==`, `++ins++`, `~sub~`, `^sup^`, `{.class}` attributes, and Obsidian's callout set on
top of GitHub's.

## Shortcut

`shift+r` shows or hides the layout guides, as the ruler button in the bottom bar does. It is there
only while the dev server is running.

## Fonts

The package carries GenSenRounded TW at 500 and 700, and Maple Mono CN at 400 and 700. Each face is
split into unicode-range chunks, so a browser fetches only the glyphs a deck sets. Nothing is
downloaded when the package is installed, and a deck needs no font provider.

Both families are licensed under the SIL Open Font License 1.1. Each ships its licence beside its
chunks in `styles/fonts/`. The theme's own code is MIT.
