<script setup>
import { useNav } from '@slidev/client'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const { currentPage } = useNav()

const shown = ref(null)
const pic = ref(null)

const scale = ref(1)
const x = ref(0)
const y = ref(0)
const dragging = ref(false)

const MAX = 8

const grip = computed(() => {
  if (scale.value === 1) return 'default'
  return dragging.value ? 'grabbing' : 'grab'
})

const style = computed(() => ({
  transform: `translate(${x.value}px, ${y.value}px) scale(${scale.value})`,
  cursor: grip.value,
}))

const clamp = (value, low, high) => Math.min(Math.max(value, low), high)

function frame() {
  const rect = pic.value.getBoundingClientRect()
  return {
    cx: (rect.left + rect.right) / 2 - x.value,
    cy: (rect.top + rect.bottom) / 2 - y.value,
    width: rect.width / scale.value,
    height: rect.height / scale.value,
  }
}

function hold(box) {
  const room = (length) => Math.max(0, ((scale.value - 1) * length) / 2)
  x.value = clamp(x.value, -room(box.width), room(box.width))
  y.value = clamp(y.value, -room(box.height), room(box.height))
}

function zoomTo(wanted, atX, atY) {
  const box = frame()
  const next = clamp(wanted, 1, MAX)
  const step = next / scale.value
  scale.value = next
  if (next === 1) {
    x.value = 0
    y.value = 0
    return
  }
  x.value = (atX - box.cx) * (1 - step) + x.value * step
  y.value = (atY - box.cy) * (1 - step) + y.value * step
  hold(box)
}

function onWheel(event) {
  event.preventDefault()
  zoomTo(scale.value * Math.exp(-event.deltaY * 0.002), event.clientX, event.clientY)
}

let from = null

function down(event) {
  from = { x: event.clientX, y: event.clientY, atX: x.value, atY: y.value, box: frame() }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}

function move(event) {
  if (!from) return
  if (scale.value === 1) return
  const dx = event.clientX - from.x
  const dy = event.clientY - from.y
  dragging.value = true
  x.value = from.atX + dx
  y.value = from.atY + dy
  hold(from.box)
}

function up() {
  from = null
  dragging.value = false
  window.removeEventListener('pointermove', move)
  window.removeEventListener('pointerup', up)
}

function pictureOf(element) {
  const url = getComputedStyle(element).backgroundImage.match(/url\(["']?(.*?)["']?\)/)
  return url && { src: url[1], credit: element.querySelector('.tmpl-credit')?.textContent ?? '' }
}

function open(event) {
  if (!event.target.closest?.('.slidev-layout')) return

  const img = event.target.closest('img')
  const picture = event.target.closest('.tmpl-picture')
  const found = img
    ? {
        src: img.currentSrc || img.src,
        credit: img.closest('figure')?.querySelector('figcaption')?.textContent ?? '',
      }
    : picture && pictureOf(picture)
  if (!found?.src) return

  // Slidev would also step the deck on this click.
  event.preventDefault()
  event.stopPropagation()
  scale.value = 1
  x.value = 0
  y.value = 0
  shown.value = found
}

function close() {
  shown.value = null
}

watch(currentPage, close)

function onKey(event) {
  if (event.key === 'Escape' && shown.value) close()
}

onMounted(() => {
  document.addEventListener('click', open, true)
  document.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', open, true)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Transition name="lightbox">
    <div v-if="shown" class="lightbox z-modal backdrop-blur-8" @click="close" @wheel="onWheel">
      <!-- Native image drag swallows the pointer events the pan uses. -->
      <img
        ref="pic"
        :src="shown.src"
        :style="style"
        draggable="false"
        @click.stop
        @pointerdown.stop="down"
      />
      <div v-if="shown.credit" class="lightbox-credit">{{ shown.credit }}</div>
      <button class="slidev-icon-btn lightbox-close" title="Close" @click="close">
        <div class="i-carbon:close" />
      </button>
    </div>
  </Transition>
</template>

<style>
.lightbox {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  background-color: color-mix(in srgb, var(--tmpl-bg) 70%, transparent);
  overflow: hidden;
}

.lightbox img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  touch-action: none;
  user-select: none;
}

.lightbox-credit {
  opacity: 0.75;
  font-size: 0.875rem;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.15s ease-out;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.slidev-layout :where(img),
.tmpl-picture {
  cursor: pointer;
}
</style>
