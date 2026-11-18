import { transformerNotationMap } from '@shikijs/transformers'
import { defineShikiSetup } from '@slidev/types'

export default defineShikiSetup(() => ({
  themes: {
    dark: 'catppuccin-mocha',
    light: 'catppuccin-latte',
  },
  // `// [!code bp]` at the end of a line marks a breakpoint.
  transformers: [transformerNotationMap({ classMap: { bp: 'code-breakpoint' } })],
}))
