import { icons } from '@iconify-json/ph'
import type MarkdownIt from 'markdown-it'
import MarkdownItAttrs from 'markdown-it-attrs'
import MarkdownItBracketedSpans from 'markdown-it-bracketed-spans'
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'
import MarkdownItIns from 'markdown-it-ins'
import MarkdownItMark from 'markdown-it-mark'
import MarkdownItSub from 'markdown-it-sub'
import MarkdownItSup from 'markdown-it-sup'
import { waves } from './waves.ts'

/* Slidev registers github-alerts with GitHub's five markers, so a second registration with `markers: '*'` runs ahead of it. */
const ICONS: Record<string, string> = {
  // Obsidian's set, with its aliases.
  note: 'note',
  info: 'info',
  abstract: 'clipboard-text',
  summary: 'clipboard-text',
  tldr: 'clipboard-text',
  todo: 'list-checks',
  tip: 'lightbulb',
  hint: 'lightbulb',
  important: 'chat-centered-text',
  success: 'check-circle',
  check: 'check-circle',
  done: 'check-circle',
  question: 'question',
  help: 'question',
  faq: 'question',
  warning: 'warning',
  attention: 'warning',
  caution: 'prohibit',
  failure: 'x-circle',
  fail: 'x-circle',
  missing: 'x-circle',
  danger: 'shield-warning',
  error: 'shield-warning',
  bug: 'bug',
  example: 'code',
  quote: 'quotes',
  cite: 'quotes',

  definition: 'book-open',
  theorem: 'seal-check',
  lemma: 'puzzle-piece',
  proof: 'check-square',
  corollary: 'git-branch',
  proposition: 'file-text',
  axiom: 'anchor',
  conjecture: 'flag',
  notation: 'pen-nib',
  remark: 'chat-circle',
  intuition: 'lightbulb',
  recall: 'arrow-counter-clockwise',
  explanation: 'flask',
  exercise: 'barbell',
  problem: 'warning-circle',
  answer: 'check',
  solution: 'seal-check',
}

const svg = (name: string) =>
  `<svg class="markdown-alert-icon" viewBox="0 0 ${icons.width} ${icons.height}" width="1em" height="1em" aria-hidden="true">${icons.icons[name].body}</svg>`

export default {
  plugins: [waves()],
  slidev: {
    markdown: {
      markdownSetup(md: MarkdownIt) {
        md.use(MarkdownItGitHubAlerts, {
          markers: '*',
          icons: Object.fromEntries(Object.entries(ICONS).map(([k, v]) => [k, svg(v)])),
        })

        /* Bracketed spans give attrs an element to attach {.class} to. */
        md.use(MarkdownItMark)
        md.use(MarkdownItIns)
        md.use(MarkdownItSup)
        md.use(MarkdownItSub)
        md.use(MarkdownItBracketedSpans)
        md.use(MarkdownItAttrs)

        /* markdown-it-attrs strips the {...} where Slidev keeps a code block's options. */
        md.core.ruler.before('curly_attributes', 'tmpl_keep_fence_info', (state) => {
          for (const token of state.tokens) {
            if (token.type === 'fence') token.meta = { ...token.meta, info: token.info }
          }
        })

        md.core.ruler.after('curly_attributes', 'tmpl_restore_fence_info', (state) => {
          for (const token of state.tokens) {
            if (token.type === 'fence' && token.meta?.info) token.info = token.meta.info
          }
        })

        /* The default marks a second citation [1:1]. */
        md.renderer.rules.footnote_caption = (tokens, idx) => `[${tokens[idx].meta.id + 1}]`
      },
    },
  },
}
