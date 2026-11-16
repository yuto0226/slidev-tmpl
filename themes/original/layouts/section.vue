<template>
  <div class="slidev-layout section">
    <div class="section-bar" />
    <div class="tmpl-body section-body">
      <slot />
    </div>
  </div>
</template>

<style>
/* A section ranges the block left, three cells in to clear the bar on that
   edge and out to the right margin.

   The h1 is a child of the body box but is placed against the slide, so the
   body box stays in flow (an absolute body box would become the h1's
   containing block). The two cannot share a declaration, because one takes
   the offset as left and the other as a margin. */
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

/* Muting everything under the h1 here avoids muting the body box and having
   the h1 undo it. */
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
