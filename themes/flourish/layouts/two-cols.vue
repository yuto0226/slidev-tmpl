<script setup>
import { track } from '../lib/track'

/* 'auto' hands the split to the content. */
defineProps({ left: { type: [Number, String] } })
</script>

<template>
  <div class="slidev-layout tmpl-page two-cols">
    <div class="tmpl-body tmpl-cols" :style="{ '--tmpl-cols-left': track(left, 'max-content') }">
      <!-- Content before the first ::marker:: spans both columns, unlike Slidev's two-cols. -->
      <div class="tmpl-cols-span">
        <slot />
      </div>
      <div class="tmpl-cols-left">
        <slot name="left" />
      </div>
      <div class="tmpl-cols-right">
        <slot name="right" />
      </div>
    </div>
    <PageNumber />
  </div>
</template>
