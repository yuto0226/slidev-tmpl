<template>
  <div class="slidev-layout quote">
    <div class="tmpl-area tmpl-middle">
      <slot />
    </div>
    <PageNumber />
  </div>
</template>

<style>
.quote blockquote {
  margin: 0;
  border-left-color: var(--tmpl-mark);
  /* Overrides the page rule that dims blockquote. */
  color: var(--tmpl-fg);
  font-size: var(--tmpl-title-size);
  line-height: 1.35;
  text-wrap: balance;
}

.quote .tmpl-area {
  gap: 0;
}

.quote blockquote + * {
  margin: calc(1.5 * var(--tmpl-cell)) 0 0 calc(var(--tmpl-cell) + 2 * var(--tmpl-rule-width));
  font-size: var(--tmpl-body-size);
  color: var(--tmpl-muted);
}

.quote blockquote + *::before {
  content: '— ';
}
</style>
