<template>
  <div class="slidev-layout tmpl-page two-cols">
    <div class="tmpl-body two-cols-left">
      <slot />
    </div>
    <div class="tmpl-body two-cols-right">
      <slot name="right" />
    </div>
    <PageNumber />
  </div>
</template>

<style>
.two-cols-left {
  width: 414px;
}

.two-cols-right {
  position: absolute;
  left: 480px;
  top: 142.38px;
  margin: 0;
  width: 414px;
}
</style>
