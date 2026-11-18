<template>
  <div class="slidev-layout tmpl-page figure">
    <div class="tmpl-body">
      <slot />
    </div>
    <div class="figure-pane">
      <slot name="figure" />
    </div>
    <PageNumber />
  </div>
</template>

<style>
.figure {
  --tmpl-body-width: calc(24 * var(--tmpl-cell));
  --tmpl-figure-x: calc(29 * var(--tmpl-cell));
  --tmpl-figure-y: calc(7 * var(--tmpl-cell));
  --tmpl-figure-height: calc(14 * var(--tmpl-cell));
}

.figure-pane {
  position: absolute;
  left: var(--tmpl-figure-x);
  top: var(--tmpl-figure-y);
  width: calc(16 * var(--tmpl-cell));
  height: var(--tmpl-figure-height);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--tmpl-flow-gap);
}

/* Slidev puts footnotes in the last slot, inside this positioned pane, so the offsets map them back to page coordinates. */
.figure-pane > .footnotes {
  left: calc(var(--tmpl-margin) - var(--tmpl-figure-x));
  width: calc(var(--tmpl-content-width) - 2 * var(--tmpl-cell));
  bottom: calc(
    var(--tmpl-figure-y) + var(--tmpl-figure-height) + var(--tmpl-cell) - var(--tmpl-canvas-height)
  );
}

.figure-pane :where(img, svg, video) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
