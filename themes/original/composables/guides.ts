import { ref } from 'vue'

/** 0 off, 1 the cells with the lines the layout's boxes cut, 2 the half
 * cells as well. */
export const guideLevel = ref(0)

export function cycleGuides() {
  guideLevel.value = (guideLevel.value + 1) % 3
}
