import { magicKeys } from '@slidev/client/state/index.ts'
import { defineShortcutsSetup } from '@slidev/types'
import { computed } from 'vue'
import { cycleGuides } from '../composables/guides'

/* A magic key combination matches whenever its own keys are down, so a bare
   shift+r fires on ctrl+shift+r as well, which is the browser's hard reload. */
const guides = computed(
  () => magicKeys['shift+r'].value && !magicKeys.control.value && !magicKeys.meta.value,
)

export default defineShortcutsSetup((_nav, base) => [
  ...base,
  ...(import.meta.env.DEV ? [{ name: 'tmpl_guides', key: guides, fn: cycleGuides }] : []),
])
