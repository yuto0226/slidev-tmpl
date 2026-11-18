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
  <div class="slidev-layout image" :style="handleBackground(image, dim, backgroundSize)">
    <div class="tmpl-area tmpl-middle">
      <slot />
    </div>
    <div v-if="credit" class="tmpl-credit">{{ credit }}</div>
    <PageNumber />
  </div>
</template>
