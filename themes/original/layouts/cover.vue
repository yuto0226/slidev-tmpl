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
/* A cover and a section are the same page: a title with a line of text under
   it. The pair is ten cells tall with three cells clear above it and five
   below, because a block on the geometric centre of a slide reads as sitting
   a little low; the title takes six cells and the text four. A cover centres
   its text and a section ranges it left.

   The title is anchored to its bottom edge, so it grows upwards and the gap
   to the text below stays fixed however many lines it takes. */
.cover-title,
.cover-subtitle {
  position: absolute;
  left: var(--tmpl-margin);
  width: var(--tmpl-content-width);
  text-align: center;
}

.cover-title {
  top: calc(3 * var(--tmpl-cell));
  height: calc(6 * var(--tmpl-cell));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  font-size: var(--tmpl-display-size);
  font-weight: 700;
}

.cover-subtitle {
  top: calc(9 * var(--tmpl-cell));
  height: calc(4 * var(--tmpl-cell));
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

/* Half a cell along the bottom edge: a rule, not a band. */
.cover-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 960px;
  height: var(--tmpl-half);
  background: var(--tmpl-mark);
}
</style>
