<script setup>
import { track } from '../lib/track'

/* 'auto' hands the split to the content. */
defineProps({ top: { type: [Number, String] } })
</script>

<template>
  <div class="slidev-layout tmpl-page two-rows">
    <div class="tmpl-body tmpl-rows" :style="{ '--tmpl-rows-top': track(top, 'auto') }">
      <div class="tmpl-rows-span">
        <slot />
      </div>
      <div class="tmpl-rows-top">
        <slot name="top" />
      </div>
      <div class="tmpl-rows-bottom">
        <slot name="bottom" />
      </div>
    </div>
    <PageNumber />
  </div>
</template>
