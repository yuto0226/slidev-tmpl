<template>
  <div class="slidev-layout section">
    <div class="section-bar" />
    <div class="tmpl-body section-body">
      <slot />
    </div>
  </div>
</template>

<style>
/* The same ten-cell block as a cover, ranged left instead of centred: the
   title takes six cells and the text under it four, and the pair is centred
   on the slide. The bar takes the first cell, so the text starts one cell
   further in than a content page's margin.

   The heading is a child of the body box but is placed against the slide, so
   the body box stays in flow: an absolute body box would become the frame the
   heading is measured from. */
/* The heading is placed and the body box flows, so they cannot share a
   declaration: one takes the offset as left, the other as a margin. */
.section {
  --section-x: calc(var(--tmpl-cell) + var(--tmpl-margin));
  --section-width: calc(960px - var(--tmpl-cell) - 2 * var(--tmpl-margin));
}

.section h1 {
  position: absolute;
  left: var(--section-x);
  width: var(--section-width);
  top: calc(4 * var(--tmpl-cell));
  height: calc(6 * var(--tmpl-cell));
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  font-size: var(--tmpl-display-size);
  font-weight: 700;
  line-height: var(--tmpl-line);
}

.section-body {
  margin: calc(10 * var(--tmpl-cell)) 0 0 var(--section-x);
  width: var(--section-width);
  height: calc(4 * var(--tmpl-cell));
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
  width: var(--tmpl-cell);
  height: 540px;
  background: var(--tmpl-mark);
}
</style>
