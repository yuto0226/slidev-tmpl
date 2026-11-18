<script setup>
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { hex } from '../lib/hex'

const props = defineProps({
  bytes: { type: String, default: '' },
  size: { type: Number, default: 0 },
  base: { type: String, default: '0x0000' },
  // Entries are { at, size } or { at, bytes }, and overflow draws in the alert colour.
  writes: { type: Array, default: () => [] },
  fill: { type: String, default: '41' },
  // Click of the first write. 0 applies all.
  fromClick: { type: Number, default: 0 },
  ascii: { type: Boolean, default: false },
})

const WIDTH = 16

const { $clicks } = useSlideContext()

const parse = (text) =>
  text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((byte) => Number.parseInt(byte, 16))

const memory = computed(() => {
  const initial = parse(props.bytes)
  const values = Array.from({ length: Math.max(props.size, initial.length) }, (_, i) => initial[i])
  const over = new Set()
  props.writes.forEach((write, i) => {
    if (props.fromClick && $clicks.value < props.fromClick + i) return
    const bytes = write.bytes
      ? parse(write.bytes)
      : Array.from({ length: write.size }, () => Number.parseInt(props.fill, 16))
    bytes.forEach((byte, k) => {
      values[write.at + k] = byte
      if (write.overflow) over.add(write.at + k)
    })
  })
  return { values, over }
})

const edge = (i) => ({
  'memory-first': i === 0,
  'memory-mid': i === WIDTH / 2,
  'memory-last': i === WIDTH - 1,
})

const columns = Array.from({ length: WIDTH }, (_, i) => hex(i, 2, { fill: ' ' }))

const BLANK = { hex: '  ', glyph: ' ', class: {} }
const UNKNOWN = { hex: '??', glyph: ' ', class: { 'memory-unknown': true } }

function cell(byte, offset) {
  if (byte === undefined) return UNKNOWN
  const printable = byte >= 0x20 && byte <= 0x7e
  return {
    hex: hex(byte, 2),
    glyph: printable ? String.fromCharCode(byte) : '.',
    class: {
      'diagram-overflow': memory.value.over.has(offset),
      'memory-unprintable': !printable,
    },
  }
}

const digits = computed(() => Math.max(4, props.base.replace(/^0x/i, '').length))

const rows = computed(() => {
  const { values } = memory.value
  const start = Number.parseInt(props.base, 16)
  const out = []
  for (let offset = 0; offset < values.length; offset += WIDTH) {
    const row = values.slice(offset, offset + WIDTH)
    out.push({
      addr: hex(start + offset, digits.value),
      cells: Array.from({ length: WIDTH }, (_, i) =>
        i < row.length ? cell(row[i], offset + i) : BLANK,
      ),
    })
  }
  return out
})
</script>

<template>
  <div class="memory-dump diagram">
    <table>
      <thead>
        <tr>
          <th class="memory-addr diagram-addr">addr</th>
          <th v-for="(column, i) in columns" :key="column" :class="edge(i)">{{ column }}</th>
          <th v-if="ascii" class="memory-ascii">ascii</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.addr">
          <th class="memory-addr diagram-addr">{{ row.addr }}</th>
          <td v-for="(cell, i) in row.cells" :key="i" :class="[cell.class, edge(i)]">
            {{ cell.hex }}
          </td>
          <td v-if="ascii" class="memory-ascii">
            <span v-for="(cell, i) in row.cells" :key="i" :class="cell.class">{{
              cell.glyph
            }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.memory-dump {
  font-size: var(--slidev-code-font-size);
  line-height: 1.6;
}

.memory-dump table {
  border-collapse: separate;
  border-spacing: 0;
}

.memory-dump th,
.memory-dump td {
  padding: 0 0.5ch;
  font-weight: 400;
  text-align: center;
  white-space: pre;
}

/* Cell bottoms land on fractional pixels, so per-cell rules misalign. */
.memory-dump thead {
  background-image: linear-gradient(var(--tmpl-rule), var(--tmpl-rule));
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: 100% var(--tmpl-rule-width);
}

.memory-dump thead th {
  color: var(--tmpl-muted);
  white-space: pre;
}

.memory-dump .memory-addr {
  padding-right: 1ch;
  border-right: var(--tmpl-rule-width) solid var(--tmpl-rule);
  text-align: right;
}

.memory-dump .memory-ascii {
  padding-left: 1ch;
  border-left: var(--tmpl-rule-width) solid var(--tmpl-rule);
  text-align: left;
  white-space: pre;
}

.memory-dump .memory-first,
.memory-dump .memory-mid,
.memory-dump .memory-last {
  background-clip: padding-box;
}

.memory-dump .memory-first {
  border-left: 0.5ch solid transparent;
}

.memory-dump .memory-mid {
  border-left: 1ch solid transparent;
}

.memory-dump .memory-last {
  border-right: 0.5ch solid transparent;
}

.memory-dump .memory-unknown {
  color: color-mix(in srgb, var(--tmpl-muted) 50%, var(--tmpl-bg));
}

/* Dimmed by colour because opacity would also fade a mark's band. */
.memory-dump .memory-unprintable {
  color: color-mix(in srgb, var(--tmpl-muted) 60%, var(--tmpl-bg));
}

/* Same specificity as .memory-unprintable, so it must stay after it. */
.memory-dump .diagram-overflow {
  color: var(--tmpl-danger);
}
</style>
