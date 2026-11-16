<template>
  <div class="tmpl-banner">
    <slot />
  </div>
</template>

<style>
/* Wider than the slide so the band still reaches both edges once it is
   rotated. */
.tmpl-banner {
  position: absolute;
  left: -120px;
  top: calc(7 * var(--tmpl-cell));
  width: 1200px;
  height: calc(4 * var(--tmpl-cell));
  transform: rotate(calc(-1 * atan(1 / 3)));
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(255 0 0 / 60%);
  font-family: var(--slidev-code-font-family);
  font-size: var(--tmpl-title-size);
  font-weight: 700;
  color: var(--tmpl-fg);
}
</style>
