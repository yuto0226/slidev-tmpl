<script setup>
import { computed } from 'vue'
import { hex } from '../lib/hex'

const props = defineProps({
  // The lowest address the frame covers, which is the bottom of the drawing.
  base: { type: String, required: true },
  // Regions in memory order, lowest address first.
  regions: { type: Array, required: true },
  wordSize: { type: Number, default: 4 },
  // A region taller than this is drawn broken rather than to scale.
  maxWords: { type: Number, default: 4 },
  steps: { type: Boolean, default: false },
})

const WORD_HEIGHT = 30

const digits = computed(() => props.base.replace(/^0x/i, '').length)

function address(offset) {
  const value = Number.parseInt(props.base, 16) + offset
  return `0x${hex(value, digits.value, { lower: true })}`
}

const rows = computed(() => {
  let offset = 0
  const out = props.regions.map((region) => {
    const words = Math.max(1, Math.round(region.size / props.wordSize))
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
      <!-- v-click is on the fill and not the region, so the region keeps its
           height before the click. v-click="false" turns the click off. -->
      <div class="stack-region" :style="{ height: `${row.height}px` }">
        <div
          v-click="steps ? '+1' : false"
          class="stack-fill"
          :class="{ 'diagram-mark': row.mark, 'stack-broken': row.broken }"
        >
          <div>{{ row.label }}</div>
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

/* An address names a boundary, so it sits on the line between two regions. */
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

/* Regions share an edge by each drawing every side but the top, and the
   topmost region gets its top back, because overlapping boxes would let the
   later one paint over the earlier one's edge. */
.stack-region {
  margin-left: 1ch;
  border: solid var(--tmpl-rule);
  border-width: 0 var(--tmpl-rule-width) var(--tmpl-rule-width);
}

.stack-top + .stack-row .stack-region {
  border-top-width: var(--tmpl-rule-width);
}

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
