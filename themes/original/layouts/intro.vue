<script setup>
import { handleBackground } from '@slidev/client/layoutHelper.ts'

defineProps({
  image: { type: String, default: '' },
})
</script>

<template>
  <div class="slidev-layout tmpl-page intro">
    <div class="tmpl-body">
      <slot />
    </div>
    <div v-if="image" class="intro-portrait tmpl-picture" :style="handleBackground(image)" />
    <PageNumber />
  </div>
</template>

<style>
.intro .tmpl-body > p:first-of-type {
  font-size: var(--tmpl-subtitle-size);
  font-weight: 700;
}

.intro:has(.intro-portrait) {
  --tmpl-body-width: calc(29 * var(--tmpl-cell));
}

.intro-portrait {
  position: absolute;
  right: var(--tmpl-margin);
  top: calc(7 * var(--tmpl-cell));
  width: calc(12 * var(--tmpl-cell));
  height: calc(12 * var(--tmpl-cell));
  border-radius: 50%;
}
</style>
