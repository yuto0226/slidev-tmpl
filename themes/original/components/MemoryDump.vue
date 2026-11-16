<script setup>
import { computed } from 'vue'

const props = defineProps({
  bytes: { type: String, required: true },
  base: { type: String, default: '0x0000' },
  // Offsets from base, start inclusive and end exclusive, like a slice.
  mark: { type: Array, default: () => [] },
  ascii: { type: Boolean, default: false },
})

const WIDTH = 16

// A heading is a column number, not a byte, so it is set in the width of one
// without the leading zero a byte would carry.
const columns = Array.from({ length: WIDTH }, (_, i) =>
  i.toString(16).toUpperCase().padStart(2, ' '),
)

// A byte outside printable ASCII has no character of its own, and the dot is
// what every hex viewer puts in its place.
function cell(byte, offset) {
  const printable = byte >= 0x20 && byte <= 0x7e
  return {
    hex: byte.toString(16).toUpperCase().padStart(2, '0'),
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
      addr: (start + offset).toString(16).toUpperCase().padStart(4, '0'),
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
          <th v-for="column in columns" :key="column">{{ column }}</th>
          <th v-if="ascii" class="memory-ascii">ascii</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.addr">
          <th class="memory-addr diagram-addr">{{ row.addr }}</th>
          <td v-for="(cell, i) in row.cells" :key="i" :class="cell.class">{{ cell.hex }}</td>
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

/* Every gap is counted in characters, the grid a hex dump is read on: one
   between bytes, two at the halfway mark, one on either side of a column
   rule. */
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

/* The address column is the one a reader counts from, so it is held apart
   from the bytes rather than reading as another byte. */
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

/* The address takes the first cell of a row, so the bytes are the second
   through the seventeenth. A gap beside a rule, or at the halfway mark, is a
   transparent border rather than padding, because a cell paints its
   background out to the padding's edge: as padding it would be swallowed by
   a marked byte's band, which would then start a gap early and sit out of
   line with its column. */
.memory-dump tr > :nth-child(2),
.memory-dump tr > :nth-child(10),
.memory-dump tr > :nth-child(17) {
  background-clip: padding-box;
}

.memory-dump tr > :nth-child(2) {
  border-left: 0.5ch solid transparent;
}

.memory-dump tr > :nth-child(10) {
  border-left: 1ch solid transparent;
}

.memory-dump tr > :nth-child(17) {
  border-right: 0.5ch solid transparent;
}

/* A byte with no character to show is still part of the dump, so it is set
   back towards the background rather than taken out. The step is in the
   colour and not in the cell's opacity, which would fade a mark's band with
   it. */
.memory-dump .memory-unprintable {
  color: color-mix(in srgb, var(--tmpl-muted) 60%, var(--tmpl-bg));
}

/* A marked byte keeps the half character of cell on either side of it; a
   marked character is just the character, because the ascii column has no
   gap between its characters for a band to reach into. */
.memory-dump .diagram-mark {
  color: var(--tmpl-bg);
}
</style>
