<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { guideLevel } from './composables/guides'

const authoring = import.meta.env.DEV

const root = ref(null)
const cols = ref([])
const rows = ref([])

/* Every edge of every box the layout placed, read back from the slide rather
   than listed here, so adding a layout needs nothing here.

   The overlay is laid out in slide units and shown scaled, so offsetWidth is
   the slide's own 960 and the ratio between the two converts a measurement
   back. */
function measure() {
  const el = root.value
  if (!el) return
  const slide = el.getBoundingClientRect()
  const scale = slide.width / el.offsetWidth
  if (!scale) return

  // The margin is drawn in CSS, and a box edge that lands on it is dropped
  // here so the line keeps its own colour rather than showing blue through a
  // translucent white.
  const margin = Number.parseFloat(getComputedStyle(el).getPropertyValue('--tmpl-margin'))
  const edges = [margin, el.offsetWidth - margin]
  const sides = [margin, el.offsetHeight - margin]

  const x = new Set()
  const y = new Set()
  for (const box of el.parentElement.querySelectorAll('h1, .tmpl-body, .tmpl-box')) {
    const r = box.getBoundingClientRect()
    if (!r.width || !r.height) continue
    x.add(Math.round((r.left - slide.left) / scale))
    x.add(Math.round((r.right - slide.left) / scale))
    y.add(Math.round((r.top - slide.top) / scale))
    y.add(Math.round((r.bottom - slide.top) / scale))
  }
  cols.value = [...x].filter((at) => !edges.includes(at)).sort((a, b) => a - b)
  rows.value = [...y].filter((at) => !sides.includes(at)).sort((a, b) => a - b)
}

/* Slidev mounts every slide at once and hides all but the current one with
   v-show, so this runs first against a display: none slide that measures
   zero. Observing the size covers that, because becoming visible is a resize;
   toggling the guides is not, so it still asks on its own. */
const observer = authoring ? new ResizeObserver(measure) : null

onMounted(() => observer?.observe(root.value))
onUnmounted(() => observer?.disconnect())

watch(guideLevel, () => requestAnimationFrame(measure))
</script>

<template>
  <!-- Slidev renders this layer inside every slide, so the overlay shares the
       slide's coordinate space and scales with it, and a line drawn at 30px
       lands on the cell the layout was placed in. -->
  <div v-if="authoring" ref="root" class="tmpl-guides">
    <template v-if="guideLevel">
      <div v-if="guideLevel === 2" class="tmpl-guides-grid tmpl-guides-halves" />
      <div class="tmpl-guides-grid tmpl-guides-cells" />
      <div
        v-for="at in cols"
        :key="`c${at}`"
        class="tmpl-guides-col"
        :style="{ left: `${at}px` }"
      />
      <div v-for="at in rows" :key="`r${at}`" class="tmpl-guides-row" :style="{ top: `${at}px` }" />
      <div class="tmpl-guides-col tmpl-guides-margin" style="left: var(--tmpl-margin)" />
      <div
        class="tmpl-guides-col tmpl-guides-margin"
        style="left: calc(100% - var(--tmpl-margin))"
      />
      <div class="tmpl-guides-row tmpl-guides-margin" style="top: var(--tmpl-margin)" />
      <div
        class="tmpl-guides-row tmpl-guides-margin"
        style="top: calc(100% - var(--tmpl-margin))"
      />
    </template>
  </div>
</template>

<style>
.tmpl-guides {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* One repeating gradient an axis draws a whole grid without a node per line.
   Half cells are where a line of text actually lands, so they are drawn under
   the cells rather than instead of them. */
.tmpl-guides-grid {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      to right,
      rgb(255 255 255 / var(--tmpl-guides-alpha)) 0 1px,
      transparent 1px var(--tmpl-guides-step)
    ),
    repeating-linear-gradient(
      to bottom,
      rgb(255 255 255 / var(--tmpl-guides-alpha)) 0 1px,
      transparent 1px var(--tmpl-guides-step)
    );
}

.tmpl-guides-halves {
  --tmpl-guides-alpha: 5%;
  --tmpl-guides-step: var(--tmpl-half);
}

.tmpl-guides-cells {
  --tmpl-guides-alpha: 10%;
  --tmpl-guides-step: var(--tmpl-cell);
}

/* A box edge cuts the whole slide, so anything else can be lined up against
   it and not only against the box it came from. The margin is the frame the
   boxes sit in rather than one of them, and it is the same on every slide, so
   it is drawn colourless and recedes. It comes last, which covers a box edge
   that lands on it.

   These colours are literals rather than tokens. An authoring aid that took
   the theme's palette would disappear against a slide using those colours. */
.tmpl-guides-col,
.tmpl-guides-row {
  position: absolute;
  background-image: repeating-linear-gradient(
    var(--tmpl-guides-along),
    var(--tmpl-guides-ink) 0 8px,
    transparent 8px 16px
  );
  --tmpl-guides-ink: #89b3fa;
}

.tmpl-guides-margin {
  --tmpl-guides-ink: rgb(255 255 255 / 45%);
}

.tmpl-guides-col {
  top: 0;
  width: 1px;
  height: 100%;
  --tmpl-guides-along: to bottom;
}

.tmpl-guides-row {
  left: 0;
  width: 100%;
  height: 1px;
  --tmpl-guides-along: to right;
}
</style>
