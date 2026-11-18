// @slidev/client ships .ts source, so type-checking it pulls Slidev's own
// build-time globals into this program. Stubbing it keeps the check on our code.
declare module '@slidev/client' {
  export function useSlideContext(): { $clicks: { value: number } }
  export function useNav(): { currentPage: { value: number } }
}

declare module '@slidev/client/state/index.ts' {
  export const magicKeys: Record<string, { value: boolean }>
}

declare module 'markdown-it-ins'
declare module 'markdown-it-mark'
declare module 'markdown-it-sub'
declare module 'markdown-it-sup'

declare module '*.css'
declare module 'virtual:tmpl-waves.css'

interface ImportMeta {
  readonly env: { readonly DEV: boolean }
}
