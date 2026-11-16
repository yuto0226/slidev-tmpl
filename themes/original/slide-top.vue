<script setup>
import { guideLevel } from './composables/guides'

const authoring = import.meta.env.DEV
</script>

<template>
  <!-- Slidev renders this layer inside every slide, so the overlay shares the
       slide's 960 by 540 coordinate space and scales with it: a line drawn at
       30px lands on the same cell the layout was placed in. -->
  <div v-if="authoring && guideLevel" class="tmpl-guides">
    <div class="tmpl-guides-cells" />
    <div class="tmpl-guides-content" />
    <div class="tmpl-guides-rule" style="top: 120px" />
    <div class="tmpl-guides-rule" style="top: 150px" />
    <template v-if="guideLevel === 2">
      <div class="tmpl-guides-phi tmpl-guides-phi-x" style="left: calc(60px + var(--tmpl-phi-x))" />
      <div
        class="tmpl-guides-phi tmpl-guides-phi-x"
        style="left: calc(900px - var(--tmpl-phi-x))"
      />
      <div class="tmpl-guides-phi tmpl-guides-phi-y" style="top: calc(60px + var(--tmpl-phi-y))" />
      <div class="tmpl-guides-phi tmpl-guides-phi-y" style="top: calc(480px - var(--tmpl-phi-y))" />
    </template>
  </div>
</template>

<style>
.tmpl-guides {
  position: absolute;
  inset: 0;
  pointer-events: none;
  --tmpl-guides-ink: #89b3fa;
  /* The content box less its golden section, measured from each edge in turn
     so both sections of both axes get a line. */
  --tmpl-phi-x: calc(var(--tmpl-content-width) / 1.618);
  --tmpl-phi-y: calc(420px / 1.618);
}

/* One gradient stop per axis draws the whole 32 by 18 grid without a node
   per line. */
.tmpl-guides-cells {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      to right,
      rgb(255 255 255 / 10%) 0 1px,
      transparent 1px var(--tmpl-cell)
    ),
    repeating-linear-gradient(
      to bottom,
      rgb(255 255 255 / 10%) 0 1px,
      transparent 1px var(--tmpl-cell)
    );
}

.tmpl-guides-content {
  position: absolute;
  inset: var(--tmpl-margin);
  border: 1px solid var(--tmpl-guides-ink);
}

/* Where the title band ends and the body box begins. */
.tmpl-guides-rule {
  position: absolute;
  left: var(--tmpl-margin);
  width: var(--tmpl-content-width);
  height: 1px;
  background: var(--tmpl-guides-ink);
}

.tmpl-guides-phi {
  position: absolute;
  --tmpl-guides-dash: repeating-linear-gradient(
    var(--tmpl-guides-angle),
    var(--tmpl-mark) 0 6px,
    transparent 6px 12px
  );
  background-image: var(--tmpl-guides-dash);
}

.tmpl-guides-phi-x {
  top: var(--tmpl-margin);
  width: 1px;
  height: 420px;
  --tmpl-guides-angle: to bottom;
}

.tmpl-guides-phi-y {
  left: var(--tmpl-margin);
  width: var(--tmpl-content-width);
  height: 1px;
  --tmpl-guides-angle: to right;
}

/* Every box a layout places, outlined where it actually landed. */
.tmpl-guides-boxes
  :is(.tmpl-body, .slidev-layout h1, .cover-title, .cover-subtitle, .tmpl-page-number) {
  outline: 1px dashed rgb(255 255 255 / 45%);
}
</style>
