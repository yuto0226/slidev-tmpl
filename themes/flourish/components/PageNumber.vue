<template>
  <div class="page-number">{{ $slidev.nav.currentPage }}</div>
</template>

<style>
.page-number {
  position: absolute;
  right: var(--tmpl-cell);
  bottom: var(--tmpl-cell);
  width: var(--tmpl-cell);
  height: var(--tmpl-cell);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--tmpl-caption-size);
  color: #cdd6f4 /* text */;
}
</style>
