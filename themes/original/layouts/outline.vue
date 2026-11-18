<template>
  <div class="slidev-layout tmpl-page outline">
    <div class="tmpl-body">
      <!-- The guides measure this box, not the 17-row body. -->
      <div class="tmpl-measure">
        <slot />
      </div>
    </div>
    <PageNumber />
  </div>
</template>

<style>
/* A grid would share row lines between columns. */
.outline .tmpl-body ol {
  --tmpl-outline-hang: 3ch;
  display: block;
  columns: 2;
  column-gap: var(--tmpl-cell);
  padding-left: 0;
  list-style: none;
  font-size: var(--tmpl-subtitle-size);
  font-weight: 700;
}

/* Any display other than list-item stops the counter. */
.outline .tmpl-body > * > ol > li {
  line-height: calc(2 * var(--tmpl-cell));
  break-inside: avoid;
  padding-left: var(--tmpl-outline-hang);
}

.outline .tmpl-body > * > ol > li::before {
  display: inline-block;
  width: var(--tmpl-outline-hang);
  margin-left: calc(-1 * var(--tmpl-outline-hang));
}

.outline .tmpl-body ul {
  display: block;
  margin: 0 0 var(--tmpl-cell) calc(var(--tmpl-indent) - var(--tmpl-outline-hang));
  padding-left: 0;
  list-style: disc;
  list-style-position: inside;
  color: var(--tmpl-muted);
  font-size: var(--tmpl-aside-size);
  font-weight: 500;
  line-height: var(--tmpl-cell);
}

.outline .tmpl-body li::before {
  color: var(--tmpl-muted);
}
</style>
