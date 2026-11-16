<script setup>
import { cycleGuides, guideLevel } from './composables/guides'

const authoring = import.meta.env.DEV

/* Slidev holds its shortcuts while a button has focus, so a click here would
   otherwise leave shift+r dead until something else took the focus back. */
function toggle(event) {
  event.currentTarget.blur()
  cycleGuides()
}
</script>

<template>
  <!-- Slidev gives an addition the last slot, past the slide counter. -->
  <template v-if="authoring">
    <div class="w-1px opacity-10 bg-current m-1 lg:m-2" />
    <button
      class="slidev-icon-btn aspect-ratio-initial flex items-center gap-1"
      :class="{ active: guideLevel > 0 }"
      title="Layout guides (shift+r)"
      @click="toggle"
    >
      <div class="i-carbon:ruler" />
      <span v-if="guideLevel" class="text-sm">{{ guideLevel }}</span>
    </button>
  </template>
</template>
