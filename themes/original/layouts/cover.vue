<template>
  <div class="slidev-layout cover">
    <div class="cover-title tmpl-box tmpl-display">
      <slot />
    </div>
    <div class="cover-subtitle tmpl-box">
      {{ $frontmatter.subtitle }}
    </div>
    <div class="cover-bar" />
  </div>
</template>

<style>
/* A cover runs the block across the content width and centres it. */
.cover-title,
.cover-subtitle {
  position: absolute;
  left: var(--tmpl-margin);
  width: var(--tmpl-content-width);
  text-align: center;
}

.cover-subtitle {
  top: var(--tmpl-text-top);
  height: var(--tmpl-text-height);
  font-size: var(--tmpl-subtitle-size);
  color: var(--tmpl-muted);
}

.cover-title :where(h1, h2, p),
.cover-subtitle :where(h1, h2, p) {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
}

/* Half a cell along the bottom edge, a rule rather than a band. */
.cover-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: var(--tmpl-canvas-width);
  height: var(--tmpl-half);
  background: var(--tmpl-mark);
}
</style>
