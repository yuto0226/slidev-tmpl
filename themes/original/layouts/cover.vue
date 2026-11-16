<template>
  <div class="slidev-layout cover">
    <div class="cover-title">
      <slot />
    </div>
    <div class="cover-subtitle">
      {{ $frontmatter.subtitle }}
    </div>
    <div class="cover-bar" />
  </div>
</template>

<style>
.cover-title,
.cover-subtitle {
  position: absolute;
  left: 120px;
  width: 720px;
  padding: var(--tmpl-inset-y) var(--tmpl-inset-x);
  text-align: center;
}

/* The box is anchored to its bottom edge, so the title grows upwards and the
   gap to the subtitle stays fixed however many lines it takes. */
.cover-title {
  top: 88.38px;
  height: 188px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: calc(var(--tmpl-inset-y) + var(--tmpl-anchor-gap));
  font-size: var(--tmpl-display-size);
  font-weight: 700;
}

.cover-subtitle {
  top: 283.63px;
  height: 130.37px;
  padding-top: calc(var(--tmpl-inset-y) + var(--tmpl-anchor-gap));
  font-size: 28px;
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

.cover-bar {
  position: absolute;
  left: 0;
  top: 511.25px;
  width: 960px;
  height: 28.35px;
  background: var(--tmpl-mark);
}
</style>
