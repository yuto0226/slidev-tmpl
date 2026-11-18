<script setup>
import { computed } from 'vue'

/* UnoCSS scans source for icon names, so each is written whole. */
const CC = 'i-fa6-brands:creative-commons'
const MARKS = {
  by: 'i-fa6-brands:creative-commons-by',
  sa: 'i-fa6-brands:creative-commons-sa',
  nc: 'i-fa6-brands:creative-commons-nc',
  nd: 'i-fa6-brands:creative-commons-nd',
}

const LICENSES = {
  by: ['姓名標示', '可自由分享與改作，標示出處即可。'],
  'by-sa': ['姓名標示-相同方式分享', '可自由分享與改作，標示出處並以相同方式釋出。'],
  'by-nd': ['姓名標示-禁止改作', '可自由分享，標示出處，不得改作。'],
  'by-nc': ['姓名標示-非商業性', '可自由分享與改作，標示出處，不得作商業使用。'],
  'by-nc-sa': [
    '姓名標示-非商業性-相同方式分享',
    '可自由分享與改作，標示出處，不得作商業使用，並以相同方式釋出。',
  ],
  'by-nc-nd': ['姓名標示-非商業性-禁止改作', '可自由分享，標示出處，不得作商業使用或改作。'],
}

const props = defineProps({
  license: { type: String, default: 'by-sa' },
  version: { type: String, default: '4.0' },
  fonts: { type: Array, default: () => ['源泉圓體、Maple Mono（OFL）'] },
  icons: {
    type: Array,
    default: () => ['Phosphor（MIT）', 'Carbon（Apache-2.0）', 'Font Awesome（CC BY 4.0）'],
  },
})

const text = computed(() => {
  const found = LICENSES[props.license]
  if (!found && import.meta.env.DEV)
    console.warn(
      `[slidev-tmpl] License: "${props.license}" is not a Creative Commons licence, ` +
        `so the card falls back to CC BY. Known: ${Object.keys(LICENSES).join(', ')}.`,
    )
  return found ?? LICENSES.by
})
const marks = computed(() => [CC, ...props.license.split('-').map((part) => MARKS[part])])
const badge = computed(() => `CC ${props.license.toUpperCase()} ${props.version}`)
</script>

<template>
  <div class="license">
    <div class="license-head">
      <div class="license-marks">
        <span v-for="mark in marks" :key="mark" :class="mark" />
      </div>
      <div>
        <b>{{ text[0] }} {{ version }} 國際</b>
        {{ text[1] }}
      </div>
    </div>
    <dl class="license-rows">
      <dt>內容</dt>
      <dd>{{ badge }}</dd>
      <dt>主題</dt>
      <dd>
        <a href="http://github.com/yuto0226/slidev-tmpl" target="_blank">yuto0226/slidev-tmpl</a
        >（MIT）
      </dd>
      <dt>字型</dt>
      <dd>
        <span v-for="font in fonts" :key="font">{{ font }}</span>
      </dd>
      <dt>圖示</dt>
      <dd>
        <span v-for="set in icons" :key="set">{{ set }}</span>
      </dd>
    </dl>
  </div>
</template>

<style>
.license {
  display: flex;
  flex-direction: column;
  gap: var(--tmpl-half);
  padding: var(--tmpl-cell);
  border: var(--tmpl-rule-width) solid var(--tmpl-rule);
  border-radius: 0.25rem;
  font-size: var(--tmpl-aside-size);
}

.license-head {
  display: flex;
  align-items: center;
  gap: var(--tmpl-cell);
}

.license-head b {
  display: block;
}

.license-marks {
  display: flex;
  flex: none;
  gap: 0.25rem;
  font-size: 1.75em;
  color: var(--tmpl-muted);
}

.license-rows {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0 var(--tmpl-cell);
  margin: 0;
  padding-top: var(--tmpl-half);
  border-top: var(--tmpl-rule-width) solid var(--tmpl-rule);
  color: var(--tmpl-muted);
}

.license-rows dd {
  margin: 0;
  color: var(--tmpl-fg);
}

.license-rows dd span {
  display: block;
}
</style>
