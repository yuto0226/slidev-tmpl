<template>
  <div class="slidev-layout tmpl-page two-cols">
    <div class="tmpl-body two-cols-left">
      <slot />
    </div>
    <div class="tmpl-body two-cols-right">
      <slot name="right" />
    </div>
    <PageNumber />
  </div>
</template>

<style>
/* The body's 28 cells split 13 and 13 with two between them. */
.two-cols-left,
.two-cols-right {
  width: calc(13 * var(--tmpl-cell));
}

.two-cols-right {
  position: absolute;
  left: calc(17 * var(--tmpl-cell));
  top: calc(5 * var(--tmpl-cell));
  margin: 0;
}
</style>
