import { reactive, ref, watch } from 'vue'

const STORE = 'tmpl-guides'

export const guidesOn = ref(false)

export const layers = reactive<Record<string, boolean>>({
  cells: true,
  halves: false,
  margin: true,
  edges: true,
  centre: false,
})

try {
  Object.assign(layers, JSON.parse(localStorage.getItem(STORE) ?? '{}'))
} catch {}

watch(layers, () => {
  try {
    localStorage.setItem(STORE, JSON.stringify(layers))
  } catch {}
})

export function toggleGuides() {
  guidesOn.value = !guidesOn.value
}
