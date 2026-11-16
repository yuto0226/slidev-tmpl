<template>
  <div class="tmpl-banner">
    <slot />
  </div>
</template>

<style>
.tmpl-banner {
  position: absolute;
  left: -102.68px;
  top: 213.31px;
  width: 1165.36px;
  height: 113.39px;
  transform: rotate(-18.426deg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(255 0 0 / 60%);
  /* A shape draws its text in the theme's second family, not the first. */
  font-family: var(--slidev-code-font-family);
  font-size: var(--tmpl-title-size);
  font-weight: 700;
  color: var(--tmpl-fg);
}
</style>
