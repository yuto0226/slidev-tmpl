<template>
  <div class="slidev-layout section">
    <div class="section-bar" />
    <div class="tmpl-body section-body">
      <slot />
    </div>
  </div>
</template>

<style>
.section h1 {
  position: absolute;
  left: 145.98px;
  top: 85.22px;
  width: 668.04px;
  height: 224.62px;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--tmpl-inset-y) var(--tmpl-inset-x);
  padding-bottom: calc(var(--tmpl-inset-y) + var(--tmpl-anchor-gap));
  font-size: var(--tmpl-display-size);
  font-weight: 700;
  line-height: var(--tmpl-line);
}

.section-body {
  margin: 309.84px 0 0 145.98px;
  width: 668.04px;
  height: 118.12px;
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
  width: 28.35px;
  height: 540px;
  background: var(--tmpl-mark);
}
</style>
