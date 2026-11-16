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
  --section-x: calc(3 * var(--tmpl-cell));
  --section-width: calc(var(--tmpl-canvas-width) - var(--section-x) - var(--tmpl-margin));
}

.section h1 {
  left: var(--section-x);
  width: var(--section-width);
}

.section-body {
  margin: var(--tmpl-text-top) 0 0 var(--section-x);
  width: var(--section-width);
  height: var(--tmpl-text-height);
}

/* The children are muted and not the body box, so the h1 does not have to undo
   it. */
.section-body > :not(h1) {
  color: var(--tmpl-muted);
}

.section-bar {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--tmpl-half);
  height: var(--tmpl-canvas-height);
  background: var(--tmpl-mark);
}
</style>
