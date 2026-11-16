import { defineShortcutsSetup } from '@slidev/types'
import { cycleGuides } from '../composables/guides'

export default defineShortcutsSetup((_nav, base) => [
  ...base,
  // shift+r is unused by Slidev, which binds d, o, g, ` and f.
  ...(import.meta.env.DEV ? [{ name: 'tmpl_guides', key: 'shift+r', fn: cycleGuides }] : []),
])
