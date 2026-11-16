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

## Status

`themes/original` carries the palette and the type, and has no layouts yet.
`decks/demo` is the type specimen used to check them.

See `AGENTS.md` for the font strategy, tooling, and commit conventions.
