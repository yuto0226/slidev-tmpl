<script setup>
import { handleBackground } from '@slidev/client/layoutHelper.ts'

defineProps({
  image: String,
  credit: String,
  backgroundSize: { type: String, default: 'cover' },
  dim: { type: Boolean, default: true },
})
</script>

<template>
  <div class="slidev-layout tmpl-page image-right">
    <div class="tmpl-image-pane tmpl-picture" :style="handleBackground(image, dim, backgroundSize)">
      <div v-if="credit" class="tmpl-credit">{{ credit }}</div>
    </div>
    <div class="tmpl-body">
      <slot />
    </div>
    <PageNumber />
  </div>
</template>
