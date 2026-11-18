<script setup>
import { computed } from 'vue'
import { hex } from '../lib/hex'

const props = defineProps({
  bytes: { type: String, required: true },
  base: { type: String, default: '0x0000' },
  // Offsets from base, start inclusive and end exclusive, like a slice.
  mark: { type: Array, default: () => [] },
  ascii: { type: Boolean, default: false },
})

const WIDTH = 16

const edge = (i) => ({
  'memory-first': i === 0,
  'memory-mid': i === WIDTH / 2,
  'memory-last': i === WIDTH - 1,
})

const columns = Array.from({ length: WIDTH }, (_, i) => hex(i, 2, { fill: ' ' }))

function cell(byte, offset) {
  const printable = byte >= 0x20 && byte <= 0x7e
  return {
    hex: hex(byte, 2),
    glyph: printable ? String.fromCharCode(byte) : '.',
    class: {
      'diagram-mark': offset >= props.mark[0] && offset < props.mark[1],
      'memory-unprintable': !printable,
    },
  }
}

const rows = computed(() => {
  const values = props.bytes
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((byte) => Number.parseInt(byte, 16))
  const start = Number.parseInt(props.base, 16)
  const out = []
  for (let offset = 0; offset < values.length; offset += WIDTH) {
    out.push({
      addr: hex(start + offset, 4),
      cells: values.slice(offset, offset + WIDTH).map((byte, i) => cell(byte, offset + i)),
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

/* Gaps are counted in characters, with one between bytes, two at the halfway
   mark and one on either side of a column rule. */
.memory-dump th,
.memory-dump td {
  padding: 0 0.5ch;
  font-weight: 400;
  text-align: center;
}

/* A shadow rather than a border, because a cell's bottom border is mitred
   into its side borders, and the transparent ones that hold the gaps open
   would notch the rule wherever a gap falls. */
.memory-dump thead th {
  box-shadow: 0 var(--tmpl-rule-width) 0 var(--tmpl-rule);
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

/* A gap held as padding would be painted by a marked byte's band, which would
   then start early and sit out of line with its column. A transparent border
   with the background clipped to the padding box keeps the band to the byte. */
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

/* A byte with no character is dimmed through its colour and not its opacity,
   which would fade a mark's band with it. */
.memory-dump .memory-unprintable {
  color: color-mix(in srgb, var(--tmpl-muted) 60%, var(--tmpl-bg));
}

/* Ties with .memory-unprintable on specificity and comes after it, so a marked
   unprintable byte keeps the mark's text colour. */
.memory-dump .diagram-mark {
  color: var(--tmpl-bg);
}
</style>
