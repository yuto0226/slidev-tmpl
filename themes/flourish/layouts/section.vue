<template>
  <div class="slidev-layout section">
    <div class="section-bar" />
    <div class="tmpl-body section-body">
      <slot />
    </div>
  </div>
</template>

<style>
.section {
  --tmpl-body-x: calc(4 * var(--tmpl-cell));
  --tmpl-body-width: calc(var(--tmpl-canvas-width) - var(--tmpl-body-x) - var(--tmpl-margin));
}

.section h1 {
  left: var(--tmpl-body-x);
  width: var(--tmpl-body-width);
}

.section-body {
  margin: var(--tmpl-text-top) 0 0 var(--tmpl-body-x);
  width: var(--tmpl-body-width);
  height: var(--tmpl-text-height);
}

.section-body > :not(h1) {
  color: var(--tmpl-muted);
}

.section-bar {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--tmpl-cell);
  height: var(--tmpl-canvas-height);
  background: var(--tmpl-mark);
}
</style>
