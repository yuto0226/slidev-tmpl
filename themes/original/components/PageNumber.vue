<template>
  <div class="tmpl-page-number">{{ $slidev.nav.currentPage }}</div>
</template>

<style>
.tmpl-page-number {
  position: absolute;
  right: 0;
  bottom: 0;
  width: var(--tmpl-cell);
  height: var(--tmpl-cell);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--tmpl-page-size);
  color: var(--tmpl-page);
}
</style>
