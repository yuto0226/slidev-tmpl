<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useCodeBand } from './composables/codeBand'
import { useFootnoteHighlight } from './composables/footnoteHighlight'
import { guidesOn, layers } from './lib/guides'

const authoring = import.meta.env.DEV

const root = ref(null)
const cols = ref([])
const rows = ref([])

useCodeBand(root)
useFootnoteHighlight(root)

function measureGuides() {
  const el = root.value
  if (!el) return
  const slide = el.getBoundingClientRect()
  const scale = slide.width / el.offsetWidth
  if (!scale) return

  const margin = Number.parseFloat(getComputedStyle(el).getPropertyValue('--tmpl-margin'))
  const marginXs = [margin, el.offsetWidth - margin]
  const marginYs = [margin, el.offsetHeight - margin]

  const x = new Set()
  const y = new Set()
  const measured = 'h1, .tmpl-body, .tmpl-measure, .tmpl-cols > *, .tmpl-rows > *'
  for (const box of el.parentElement.querySelectorAll(measured)) {
    const r = box.getBoundingClientRect()
    if (!r.width || !r.height) continue
    x.add(Math.round((r.left - slide.left) / scale))
    x.add(Math.round((r.right - slide.left) / scale))
    y.add(Math.round((r.top - slide.top) / scale))
    y.add(Math.round((r.bottom - slide.top) / scale))
  }
  cols.value = [...x].filter((at) => !marginXs.includes(at)).sort((a, b) => a - b)
  rows.value = [...y].filter((at) => !marginYs.includes(at)).sort((a, b) => a - b)
}

/* Slidev hides non-current slides with v-show; becoming visible fires a resize. */
const observer = authoring ? new ResizeObserver(measureGuides) : null

onMounted(() => observer?.observe(root.value))
onUnmounted(() => observer?.disconnect())

watch([guidesOn, layers], () => requestAnimationFrame(measureGuides))
</script>

<template>
  <div ref="root" class="guides">
    <template v-if="authoring && guidesOn">
      <template v-if="layers.halves">
        <div class="guides-grid guides-halves guides-down" />
        <div class="guides-grid guides-halves guides-across" />
      </template>
      <div v-if="layers.cells" class="guides-grid guides-cells guides-down guides-across" />
      <template v-if="layers.edges">
        <div v-for="at in cols" :key="`c${at}`" class="guides-col" :style="{ left: `${at}px` }" />
        <div v-for="at in rows" :key="`r${at}`" class="guides-row" :style="{ top: `${at}px` }" />
      </template>
      <template v-if="layers.centre">
        <div class="guides-col guides-centre" style="left: 50%" />
        <div class="guides-row guides-centre" style="top: 50%" />
      </template>
      <template v-if="layers.margin">
        <div class="guides-col guides-margin" style="left: var(--tmpl-margin)" />
        <div class="guides-col guides-margin" style="left: calc(100% - var(--tmpl-margin))" />
        <div class="guides-row guides-margin" style="top: var(--tmpl-margin)" />
        <div class="guides-row guides-margin" style="top: calc(100% - var(--tmpl-margin))" />
      </template>
    </template>
  </div>
</template>

<style>
.guides {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.guides-grid {
  position: absolute;
  inset: 0;
  --guides-line: rgb(255 255 255 / var(--guides-alpha));
  background-image: var(--guides-v, none), var(--guides-h, none);
}

.guides-down {
  --guides-v: repeating-linear-gradient(
    to right,
    var(--guides-line) 0 1px,
    transparent 1px var(--guides-step)
  );
}

.guides-across {
  --guides-h: repeating-linear-gradient(
    to bottom,
    var(--guides-line) 0 1px,
    transparent 1px var(--guides-step)
  );
}

.guides-halves {
  --guides-alpha: 8%;
  --guides-step: var(--tmpl-half);
}

.guides-halves.guides-down {
  mask-image: repeating-linear-gradient(to bottom, #000 0 2px, transparent 2px 4px);
}

.guides-halves.guides-across {
  mask-image: repeating-linear-gradient(to right, #000 0 2px, transparent 2px 4px);
}

.guides-cells {
  --guides-alpha: 10%;
  --guides-step: var(--tmpl-cell);
}

.guides-col,
.guides-row {
  position: absolute;
  background-image: repeating-linear-gradient(
    var(--guides-along),
    var(--guides-ink) 0 8px,
    transparent 8px 16px
  );
  --guides-ink: var(--tmpl-accent);
}

.guides-margin {
  --guides-ink: rgb(255 255 255 / 45%);
}

.guides-centre {
  --guides-ink: color-mix(in srgb, var(--tmpl-danger) 55%, transparent);
}

.guides-col {
  top: 0;
  width: 1px;
  height: 100%;
  --guides-along: to bottom;
}

.guides-row {
  left: 0;
  width: 100%;
  height: 1px;
  --guides-along: to right;
}
</style>
