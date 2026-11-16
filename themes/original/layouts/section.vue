<template>
  <div class="slidev-layout section">
    <div class="section-bar" />
    <div class="tmpl-body section-body">
      <slot />
    </div>
  </div>
</template>

<style>
/* The bar takes the first cell, so the text starts at the fifth rather than
   at a content page's second. The title is anchored to its bottom edge and
   grows upwards; the body hangs under that edge.

   The heading is a child of the body box but is placed against the slide, so
   the body box stays in flow: an absolute body box would become the frame the
   heading is measured from. */
.section h1 {
  position: absolute;
  left: calc(5 * var(--tmpl-cell));
  top: calc(4 * var(--tmpl-cell));
  width: calc(960px - 5 * var(--tmpl-cell) - var(--tmpl-margin));
  height: calc(7 * var(--tmpl-cell));
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  font-size: var(--tmpl-display-size);
  font-weight: 700;
  line-height: var(--tmpl-line);
}

.section-body {
  margin: calc(11 * var(--tmpl-cell)) 0 0 calc(5 * var(--tmpl-cell));
  width: calc(960px - 5 * var(--tmpl-cell) - var(--tmpl-margin));
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
