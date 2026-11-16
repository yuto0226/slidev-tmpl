<template>
  <div class="tmpl-page-number tmpl-box">{{ $slidev.nav.currentPage }}</div>
</template>

<style>
/* Two cells out from the content area's bottom right corner, which the two
   cell margin makes the last cell of the slide. */
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
  font-weight: 500;
  color: var(--tmpl-page);
}
</style>
