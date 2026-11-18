<script setup>
import { track } from '../lib/track'

defineProps({
  left: { type: [Number, String] },
  license: { type: String, default: 'by-sa' },
  fonts: Array,
  icons: Array,
})
</script>

<template>
  <div class="slidev-layout tmpl-page end">
    <div class="tmpl-body tmpl-cols" :style="{ '--tmpl-cols-left': track(left, 'max-content') }">
      <div class="tmpl-cols-left">
        <slot />
      </div>
      <div class="tmpl-cols-right">
        <License :license="license" :fonts="fonts" :icons="icons" />
        <div class="end-made">使用 <a href="https://sli.dev">Slidev</a> 製作</div>
      </div>
    </div>
  </div>
</template>

<style>
.end .tmpl-body {
  margin-top: 0;
  height: var(--tmpl-canvas-height);
  grid-template-rows: auto;
  align-content: center;
}

.end .tmpl-cols-left {
  font-size: var(--tmpl-aside-size);
}

.end .tmpl-cols-left h2 {
  font-size: var(--tmpl-body-size);
}

.end-made {
  margin-top: var(--tmpl-quarter);
  text-align: right;
  color: var(--tmpl-muted);
  font-size: var(--tmpl-caption-size);
}
</style>
