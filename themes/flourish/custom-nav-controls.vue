<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { guidesOn, layers, toggleGuides } from './lib/guides'

const authoring = import.meta.env.DEV

/* UnoCSS scans source for class names, so the icons are written whole. */
const ROWS = [
  { key: 'cells', name: 'cell grid', icon: 'i-ph:grid-four' },
  { key: 'halves', name: 'half cells', icon: 'i-ph:grid-nine' },
  { key: 'margin', name: 'margin', icon: 'i-ph:frame-corners' },
  { key: 'edges', name: 'content edges', icon: 'i-ph:bounding-box' },
  { key: 'centre', name: 'centre', icon: 'i-ph:crosshair' },
]

const open = ref(false)
const root = ref(null)

/* Slidev ignores shortcuts while a button has focus. */
function act(event, fn) {
  event.currentTarget.blur()
  fn()
}

function close(event) {
  if (!root.value?.contains(event.target)) open.value = false
}

onMounted(() => document.addEventListener('pointerdown', close))
onBeforeUnmount(() => document.removeEventListener('pointerdown', close))
</script>

<template>
  <template v-if="authoring">
    <div class="w-1px opacity-10 bg-current m-1 lg:m-2" />
    <div ref="root" class="nav-guides">
      <button
        class="slidev-icon-btn"
        :class="{ active: guidesOn }"
        title="Layout guides (shift+r)"
        @click="act($event, toggleGuides)"
      >
        <div class="i-carbon:ruler" />
      </button>
      <button
        class="slidev-icon-btn"
        title="Which guides to draw"
        @click="act($event, () => (open = !open))"
      >
        <div class="i-carbon:chevron-up" />
      </button>
      <div
        v-if="open"
        class="nav-panel bg-main text-main border border-main rounded-md shadow-xl z-menu"
      >
        <label v-for="row in ROWS" :key="row.key">
          <!-- Slidev's checkbox is internal. -->
          <span class="nav-box border border-main rounded">
            <span v-show="layers[row.key]" class="i-ph:check" />
            <input v-model="layers[row.key]" type="checkbox" />
          </span>
          <span :class="[row.icon, `nav-icon-${row.key}`]" class="nav-icon" />
          {{ row.name }}
        </label>
      </div>
    </div>
  </template>
</template>

<style>
.nav-guides {
  position: relative;
  display: flex;
  align-items: center;
}

.nav-panel {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 0.5rem;
  /* Matches Slidev's menus, text-sm at px4 py2. */
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  white-space: nowrap;
  font-size: 0.875rem;
}

.nav-panel label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  opacity: 0.75;
}

.nav-box {
  flex: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
}

.nav-box input {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.nav-icon {
  flex: none;
  font-size: 1rem;
}

.nav-icon-cells,
.nav-icon-halves,
.nav-icon-margin {
  opacity: 0.6;
}

.nav-icon-edges {
  color: var(--tmpl-accent);
}

.nav-icon-centre {
  color: var(--tmpl-danger);
}
</style>
