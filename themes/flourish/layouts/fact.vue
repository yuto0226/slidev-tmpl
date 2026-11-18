<template>
  <div class="slidev-layout fact">
    <div class="tmpl-area tmpl-middle">
      <slot />
    </div>
    <PageNumber />
  </div>
</template>

<style>
.fact .tmpl-area {
  align-items: center;
  text-align: center;
}

.fact h1 {
  margin: 0;
  font-size: calc(6 * var(--tmpl-cell));
  line-height: var(--tmpl-heading-line);
  color: var(--tmpl-mark);
}

.fact :where(h1) + * {
  font-size: var(--tmpl-subtitle-size);
  color: var(--tmpl-fg);
}

.fact :where(h1) + * ~ * {
  font-size: var(--tmpl-note-size);
  color: var(--tmpl-muted);
}
</style>
