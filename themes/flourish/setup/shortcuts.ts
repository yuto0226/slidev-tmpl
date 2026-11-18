import { magicKeys } from '@slidev/client/state/index.ts'
import { defineShortcutsSetup } from '@slidev/types'
import { computed } from 'vue'
import { toggleGuides } from '../lib/guides'

/* shift+r also matches ctrl+shift+r, the browser's hard reload. */
const guides = computed(
  () => magicKeys['shift+r'].value && !magicKeys.control.value && !magicKeys.meta.value,
)

export default defineShortcutsSetup((_nav, base) => [
  ...base,
  ...(import.meta.env.DEV ? [{ name: 'tmpl_guides', key: guides, fn: toggleGuides }] : []),
])
