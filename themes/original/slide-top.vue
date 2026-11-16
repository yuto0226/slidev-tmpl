<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { guideLevel } from './composables/guides'

const authoring = import.meta.env.DEV

const root = ref(null)
const cols = ref([])
const rows = ref([])
const marginCols = ref([])
const marginRows = ref([])

/* Every edge of every box the layout placed, read back from the slide rather
   than listed here, so a layout gets its lines by existing. The margin is
   measured from its token rather than from an element, because no element
   stands for it, and a box edge that lands on it is dropped so the margin
   keeps its own colour there. */
function measure() {
  const el = root.value
  if (!el) return
  const slide = el.getBoundingClientRect()
  const scale = slide.width / 960
  if (!scale) return

  const margin = Number.parseFloat(getComputedStyle(el).getPropertyValue('--tmpl-margin'))
  marginCols.value = [margin, 960 - margin]
  marginRows.value = [margin, 540 - margin]

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
  cols.value = [...x].filter((at) => !marginCols.value.includes(at)).sort((a, b) => a - b)
  rows.value = [...y].filter((at) => !marginRows.value.includes(at)).sort((a, b) => a - b)
}

/* Slidev mounts every slide at once and hides all but the current one with
   v-show, so this runs first against a display: none slide that measures
   zero. Observing the size covers that, because becoming visible is a resize;
   toggling the guides is not, so it still asks on its own. */
onMounted(() => {
  const observer = new ResizeObserver(measure)
  observer.observe(root.value)
  onUnmounted(() => observer.disconnect())
})

watch(guideLevel, () => requestAnimationFrame(measure))
</script>

<template>
  <!-- Slidev renders this layer inside every slide, so the overlay shares the
       slide's 960 by 540 coordinate space and scales with it: a line drawn at
       30px lands on the same cell the layout was placed in. -->
  <div v-if="authoring" ref="root" class="tmpl-guides" :class="{ 'tmpl-guides-on': guideLevel }">
    <template v-if="guideLevel">
      <div v-if="guideLevel === 2" class="tmpl-guides-halves" />
      <div class="tmpl-guides-cells" />
      <div
        v-for="at in cols"
        :key="`c${at}`"
        class="tmpl-guides-col"
        :style="{ left: `${at}px` }"
      />
      <div v-for="at in rows" :key="`r${at}`" class="tmpl-guides-row" :style="{ top: `${at}px` }" />
      <div
        v-for="at in marginCols"
        :key="`mc${at}`"
        class="tmpl-guides-col tmpl-guides-margin"
        :style="{ left: `${at}px` }"
      />
      <div
        v-for="at in marginRows"
        :key="`mr${at}`"
        class="tmpl-guides-row tmpl-guides-margin"
        :style="{ top: `${at}px` }"
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

/* The overlay has to be measurable before it has anything to draw, so it is
   always in the slide and only its contents come and go. */
.tmpl-guides:not(.tmpl-guides-on) {
  visibility: hidden;
}

/* Half cells are where a line of text actually lands, so they are drawn
   under the cells rather than instead of them. */
.tmpl-guides-halves {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      to right,
      rgb(255 255 255 / 5%) 0 1px,
      transparent 1px var(--tmpl-half)
    ),
    repeating-linear-gradient(
      to bottom,
      rgb(255 255 255 / 5%) 0 1px,
      transparent 1px var(--tmpl-half)
    );
}

/* One gradient stop per axis draws the whole 32 by 18 grid without a node
   per line. */
.tmpl-guides-cells {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      to right,
      rgb(255 255 255 / 10%) 0 1px,
      transparent 1px var(--tmpl-cell)
    ),
    repeating-linear-gradient(
      to bottom,
      rgb(255 255 255 / 10%) 0 1px,
      transparent 1px var(--tmpl-cell)
    );
}

/* A box edge cuts the whole slide, so anything else on the slide can be lined
   up against it and not only against the box it came from. The margin is the
   frame the boxes sit in rather than one of them, and it is the one line that
   is the same on every slide, so it is drawn colourless and recedes.

   These colours are literals, not tokens: an authoring aid that took the
   theme's palette would disappear against a slide using the same colours. */
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
  height: 540px;
  --tmpl-guides-along: to bottom;
}

.tmpl-guides-row {
  left: 0;
  width: 960px;
  height: 1px;
  --tmpl-guides-along: to right;
}
</style>
