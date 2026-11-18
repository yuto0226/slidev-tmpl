<script setup>
import { track } from '../lib/track'

/* 'auto' hands the split to the content. */
defineProps({ left: { type: [Number, String] } })
</script>

<template>
  <div class="slidev-layout tmpl-page two-cols-header">
    <div class="tmpl-body tmpl-cols" :style="{ '--tmpl-cols-left': track(left, 'max-content') }">
      <div class="tmpl-cols-span">
        <slot />
      </div>
      <div class="tmpl-cols-left">
        <slot name="left" />
      </div>
      <div class="tmpl-cols-right">
        <slot name="right" />
      </div>
      <div class="tmpl-cols-span tmpl-cols-bottom">
        <slot name="bottom" />
      </div>
    </div>
    <PageNumber />
  </div>
</template>
