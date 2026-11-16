import { ref, watchEffect } from 'vue'

/** 0 off, 1 the grid, 2 the grid with the golden sections and every box. */
export const guideLevel = ref(0)

export function cycleGuides() {
  guideLevel.value = (guideLevel.value + 1) % 3
}

/* The overlay is a sibling of the slide and cannot reach the boxes a layout
   places, so the outlines are switched on from the document instead. */
watchEffect(() => {
  document.documentElement.classList.toggle('tmpl-guides-boxes', guideLevel.value === 2)
})
