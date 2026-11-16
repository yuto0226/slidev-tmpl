<template>
  <div class="slidev-layout section">
    <div class="section-bar" />
    <div class="tmpl-body section-body">
      <slot />
    </div>
  </div>
</template>

<style>
/* A section ranges the block left, starting three cells in to clear the bar
   along that edge and running to the right margin.

   The heading is a child of the body box but is placed against the slide, so
   the body box stays in flow. An absolute body box would become the frame the
   heading is measured from. That is also why the two cannot share one
   declaration, since one takes the offset as a left edge and the other as a
   margin. */
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

/* The heading is a child of the body box, so the box mutes what is under the
   heading rather than everything, which the heading would then have to undo. */
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
