<template>
  <div class="slidev-layout statement">
    <div class="tmpl-area tmpl-middle">
      <slot />
    </div>
    <PageNumber />
  </div>
</template>

<style>
.statement .tmpl-area {
  align-items: center;
  text-align: center;
}

.statement :where(h1, h2, p) {
  margin: 0;
  font-size: var(--tmpl-display-size);
  font-weight: 700;
  line-height: var(--tmpl-heading-line);
  text-wrap: balance;
}
</style>
