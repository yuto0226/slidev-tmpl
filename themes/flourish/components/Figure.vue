<script setup>
defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  credit: { type: String, default: '' },
})
</script>

<template>
  <figure class="tmpl-figure">
    <img :src="src" :alt="alt" />
    <figcaption v-if="credit">{{ credit }}</figcaption>
  </figure>
</template>

<style>
.tmpl-figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--tmpl-quarter);
  min-height: 0;
}

.tmpl-figure img {
  min-height: 0;
  object-fit: contain;
}

.tmpl-figure figcaption {
  color: var(--tmpl-muted);
  font-size: var(--tmpl-caption-size);
}
</style>
