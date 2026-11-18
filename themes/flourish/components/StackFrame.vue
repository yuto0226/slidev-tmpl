<script setup>
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { hex } from '../lib/hex'

const props = defineProps({
  base: { type: String, required: true },
  // A region's overflow is the label it takes once the writing reaches it.
  regions: { type: Array, required: true },
  wordSize: { type: Number, default: 4 },
  maxWords: { type: Number, default: 4 },
  steps: { type: Boolean, default: false },
  // Click the writing reaches the lowest region. 0 leaves marking to the regions.
  fromClick: { type: Number, default: 0 },
  sp: { type: String, default: '' },
})

const { $clicks } = useSlideContext()

const WORD_HEIGHT = 30

const digits = computed(() => props.base.replace(/^0x/i, '').length)

function address(offset) {
  const value = Number.parseInt(props.base, 16) + offset
  return `0x${hex(value, digits.value, { lower: true })}`
}

const rows = computed(() => {
  let offset = 0
  const out = props.regions.map((region, i) => {
    const words = Math.max(1, Math.round(region.size / props.wordSize))
    const hit = props.fromClick
      ? Boolean(region.overflow) && $clicks.value >= props.fromClick + i
      : false
    const row = {
      ...region,
      addr: address(offset),
      broken: words > props.maxWords,
      height: Math.min(words, props.maxWords) * WORD_HEIGHT,
      hit,
      label: hit && typeof region.overflow === 'string' ? region.overflow : region.label,
      mark: props.fromClick ? false : region.mark,
    }
    offset += region.size
    return row
  })
  return out.reverse()
})

const top = computed(() => address(props.regions.reduce((sum, region) => sum + region.size, 0)))

const edges = computed(() => {
  let y = 0
  return rows.value.map((row) => (y += row.height))
})

const pushed = computed(() =>
  props.steps ? Math.min($clicks.value, rows.value.length) : rows.value.length,
)

const registers = computed(() => {
  const listed = rows.value
    .map((row, k) => ({ name: row.pointer, y: edges.value[k], shown: pushed.value > k }))
    .filter((register) => register.name)
  // Listed first so it is the register that moves off a shared line.
  if (props.sp) {
    listed.unshift({
      name: props.sp,
      y: pushed.value ? edges.value[pushed.value - 1] : 0,
      shown: true,
    })
  }
  const out = []
  for (const register of listed) {
    const together =
      register.shown && out.find((other) => other.names.length && other.y === register.y)
    // The line is left-anchored, so the name that stays goes first.
    if (together) together.names.unshift(register.name)
    out.push({ ...register, names: register.shown && !together ? [register.name] : [] })
  }
  return out
})
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
      <!-- v-click sits on the fill so the region keeps its height before the click. -->
      <div class="stack-region" :style="{ height: `${row.height}px` }">
        <div
          v-click="steps ? '+1' : false"
          class="stack-fill"
          :class="{
            'diagram-mark': row.mark,
            'diagram-overflow': row.hit,
            'stack-truncated': row.broken,
          }"
        >
          <div>{{ row.label }}</div>
          <div v-if="row.broken" class="stack-size">{{ row.size }} bytes</div>
        </div>
      </div>
    </div>
    <div
      v-for="register in registers"
      :key="register.name"
      class="stack-register diagram-addr"
      :style="{ top: `${register.y}px`, opacity: register.names.length ? 1 : 0 }"
    >
      &lt;- {{ register.names.join(', ') }}
    </div>
  </div>
</template>

<style>
/* A grid per row would size columns per row and misalign the boxes. */
.stack-frame {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  padding-right: 10ch;
  font-size: 16px;
  line-height: 1.4;
}

.stack-row {
  display: contents;
}

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

.stack-top .stack-addr {
  height: 0;
}

/* The arrow sits in a character cell of its own, so half of one is taken back. */
.stack-register {
  position: absolute;
  left: calc(100% - 10ch);
  margin-left: -0.5ch;
  translate: 0 -50%;
  white-space: nowrap;
  font-size: 14px;
  transition:
    top 300ms ease,
    opacity 200ms ease;
}

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

.stack-truncated {
  background-image: linear-gradient(to right, var(--tmpl-rule) 50%, transparent 50%);
  background-position: 0 50%;
  background-repeat: repeat-x;
  background-size: 12px var(--tmpl-rule-width);
}

.stack-truncated > * {
  background: var(--tmpl-bg);
  padding: 0 1ch;
}

.diagram-mark.stack-truncated > * {
  background: var(--tmpl-mark);
}

.diagram-overflow.stack-truncated {
  background-image: linear-gradient(to right, var(--tmpl-danger) 50%, transparent 50%);
}

.diagram-overflow .stack-size {
  color: inherit;
}

.diagram-mark .stack-size {
  color: inherit;
}
</style>
