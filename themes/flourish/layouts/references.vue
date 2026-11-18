<template>
  <div class="slidev-layout tmpl-page references">
    <div class="tmpl-body">
      <slot />
    </div>
    <PageNumber />
  </div>
</template>

<style>
/* Entries are styled with the footnotes, in prose.css. */
.references .tmpl-body ol {
  columns: 2;
  column-gap: var(--tmpl-cell);
  font-size: var(--tmpl-note-size);
}

.references .tmpl-body li {
  break-inside: avoid;
}

.references .tmpl-body li + li {
  margin-top: var(--tmpl-flow-gap);
}
</style>
