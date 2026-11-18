import { useSlideContext } from '@slidev/client'
import { onMounted, onUnmounted, watch } from 'vue'

export function useCodeBand(root: { value: HTMLElement | null }) {
  const { $clicks } = useSlideContext()

  function placeBand() {
    const el = root.value
    if (!el) return
    for (const code of el.parentElement!.querySelectorAll<HTMLElement>('.slidev-code code')) {
      const highlighted = code.querySelectorAll<HTMLElement>('.slidev-code-highlighted')
      const anyDimmed = highlighted.length && code.querySelector('.slidev-code-dishonored')
      const previousHeight = code.style.getPropertyValue('--tmpl-code-band-height')
      const snap = !previousHeight || previousHeight === '0px' || !anyDimmed
      if (snap) code.style.transition = 'none'
      if (anyDimmed) {
        const codeBox = code.getBoundingClientRect()
        const scale = codeBox.width / code.offsetWidth || 1
        const firstLine = highlighted[0].getBoundingClientRect()
        const lastLine = highlighted[highlighted.length - 1].getBoundingClientRect()
        code.style.setProperty('--tmpl-code-band-top', `${(firstLine.top - codeBox.top) / scale}px`)
        code.style.setProperty(
          '--tmpl-code-band-height',
          `${(lastLine.bottom - firstLine.top) / scale}px`,
        )
      } else {
        code.style.setProperty('--tmpl-code-band-height', '0px')
      }
      if (snap) requestAnimationFrame(() => (code.style.transition = ''))
    }
  }

  // After Slidev's own watcher has written the new click's classes.
  watch($clicks, () => requestAnimationFrame(placeBand), { flush: 'post' })

  const observer = new ResizeObserver(placeBand)
  onMounted(() => observer.observe(root.value!))
  onUnmounted(() => observer.disconnect())
}
