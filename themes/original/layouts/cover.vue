<template>
  <div class="slidev-layout cover">
    <div class="cover-title tmpl-box">
      <slot />
    </div>
    <div class="cover-subtitle tmpl-box">
      {{ $frontmatter.subtitle }}
    </div>
    <div class="cover-bar" />
  </div>
</template>

<style>
/* Four cells in from each edge, so the block is narrower than a content
   page's and reads as a different kind of slide. */
.cover-title,
.cover-subtitle {
  position: absolute;
  left: calc(4 * var(--tmpl-cell));
  width: calc(960px - 8 * var(--tmpl-cell));
  text-align: center;
}

/* The box is anchored to its bottom edge, so the title grows upwards and the
   gap to the subtitle stays fixed however many lines it takes. Two lines of
   display type fill it exactly. */
.cover-title {
  top: calc(5 * var(--tmpl-cell));
  height: calc(5 * var(--tmpl-cell));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  font-size: var(--tmpl-display-size);
  font-weight: 700;
}

.cover-subtitle {
  top: calc(10 * var(--tmpl-cell));
  height: calc(3 * var(--tmpl-cell));
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

/* One cell along the bottom edge. */
.cover-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 960px;
  height: var(--tmpl-cell);
  background: var(--tmpl-mark);
}
</style>
