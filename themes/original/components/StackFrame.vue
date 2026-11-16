<script setup>
import { computed } from 'vue'

const props = defineProps({
  // The lowest address the frame covers, which is the bottom of the drawing.
  base: { type: String, required: true },
  // Regions in memory order, lowest address first.
  regions: { type: Array, required: true },
  word: { type: Number, default: 4 },
  // A region taller than this is drawn broken rather than to scale.
  maxWords: { type: Number, default: 4 },
  // Fill the regions one click at a time.
  steps: { type: Boolean, default: false },
})

const WORD_HEIGHT = 30

const digits = computed(() => props.base.replace(/^0x/i, '').length)

function address(offset) {
  const value = Number.parseInt(props.base, 16) + offset
  return `0x${value.toString(16).padStart(digits.value, '0')}`
}

// A frame is drawn to scale, because how far a buffer reaches is the thing a
// frame is usually drawn to show. A region too tall to fit is cut instead.
//
// The regions arrive in memory order and are drawn in reverse, highest
// address first, which is both the order they appear down the page and the
// order a frame is pushed in: return address, saved frame pointer, locals.
const rows = computed(() => {
  let offset = 0
  const out = props.regions.map((region) => {
    const words = Math.max(1, Math.round(region.size / props.word))
    const row = {
      ...region,
      addr: address(offset),
      broken: words > props.maxWords,
      height: Math.min(words, props.maxWords) * WORD_HEIGHT,
    }
    offset += region.size
    return row
  })
  return out.reverse()
})

const top = computed(() => address(props.regions.reduce((sum, region) => sum + region.size, 0)))
</script>

<template>
  <div class="stack-frame diagram">
    <div class="stack-row stack-top">
      <div class="stack-addr diagram-addr">
        <span>{{ top }}</span>
      </div>
      <div />
    </div>
    <div v-for="row in rows" :key="row.addr" class="stack-row">
      <div class="stack-addr diagram-addr">
        <span>{{ row.addr }}</span>
      </div>
      <!-- The region is the layout and stands from the start; what a click
           brings is inside it, so the fill is the click's target. false is
           the value that turns a click off. -->
      <div class="stack-region" :style="{ height: `${row.height}px` }">
        <div
          v-click="steps ? '+1' : false"
          class="stack-fill"
          :class="{ 'diagram-mark': row.mark, 'stack-broken': row.broken }"
        >
          <div>{{ row.label }}</div>
          <!-- A region drawn to scale states its size by its height. One cut
               short has to say it. -->
          <div v-if="row.broken" class="stack-size">{{ row.size }} bytes</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.stack-frame {
  font-size: 16px;
  line-height: 1.4;
}

.stack-row {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
}

/* An address names a boundary, not a region, so it sits on the line between
   two regions rather than beside the middle of one. */
.stack-addr {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding-right: 1ch;
  font-size: 14px;
}

.stack-addr > span {
  translate: 0 50%;
}

/* A region is outlined rather than filled. Two regions share one edge: each
   draws every side but the top, and the region at the top of the frame is
   given that one back. Overlapping two boxes instead would let the later of
   them paint over the edge of the one before it. */
.stack-region {
  margin-left: 1ch;
  border: solid var(--tmpl-rule);
  border-width: 0 var(--tmpl-rule-width) var(--tmpl-rule-width);
}

.stack-top + .stack-row .stack-region {
  border-top-width: var(--tmpl-rule-width);
}

/* A region the stack has not reached is outlined a step darker. */
.stack-region:has(.slidev-vclick-hidden) {
  border-color: var(--tmpl-rule-dim);
}

.stack-fill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.stack-size {
  color: var(--tmpl-muted);
  font-size: 12px;
}

/* A region drawn short of its size is cut across the middle, so its height
   is read as elided rather than as the size it was given. */
.stack-broken {
  background-image: linear-gradient(to right, var(--tmpl-rule) 50%, transparent 50%);
  background-position: 0 50%;
  background-repeat: repeat-x;
  background-size: 12px var(--tmpl-rule-width);
}

.stack-broken > * {
  background: var(--tmpl-bg);
  padding: 0 1ch;
}

.diagram-mark .stack-size {
  color: inherit;
}
</style>
