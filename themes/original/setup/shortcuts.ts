import { defineShortcutsSetup } from '@slidev/types'
import { cycleGuides } from '../composables/guides'

export default defineShortcutsSetup((_nav, base) => [
  ...base,
  // The guides are a drawing aid, so the key exists only while authoring. The
  // letter is free: d, o, g, ` and f already belong to Slidev.
  ...(import.meta.env.DEV ? [{ name: 'tmpl_guides', key: 'shift+r', fn: cycleGuides }] : []),
])
