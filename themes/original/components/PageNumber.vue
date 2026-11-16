<template>
  <div class="tmpl-page-number">{{ $slidev.nav.currentPage }}</div>
</template>

<style>
.tmpl-page-number {
  position: absolute;
  left: 728.68px;
  top: 500.5px;
  width: 216px;
  height: 28.75px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: var(--tmpl-inset-y) var(--tmpl-inset-x);
  font-size: var(--tmpl-page-size);
  font-weight: 500;
  color: var(--tmpl-page);
}
</style>
