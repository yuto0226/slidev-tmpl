<template>
  <div class="tmpl-page-number tmpl-box">{{ $slidev.nav.currentPage }}</div>
</template>

<style>
/* The bottom margin band, right-aligned with the content area's right edge. */
.tmpl-page-number {
  position: absolute;
  right: var(--tmpl-margin);
  bottom: 0;
  width: calc(8 * var(--tmpl-cell));
  height: var(--tmpl-margin);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: var(--tmpl-page-size);
  font-weight: 500;
  color: var(--tmpl-page);
}
</style>
