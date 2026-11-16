import { transformerNotationMap } from '@shikijs/transformers'
import { defineShikiSetup } from '@slidev/types'

export default defineShikiSetup(() => ({
  themes: {
    dark: 'catppuccin-mocha',
    light: 'catppuccin-latte',
  },
  // A line ending in `// [!code bp]` is one a debugger was told to stop at.
  transformers: [transformerNotationMap({ classMap: { bp: 'code-breakpoint' } })],
}))
