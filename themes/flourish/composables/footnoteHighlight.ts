import { useNav, useSlideContext } from '@slidev/client'
import { onMounted, onUnmounted, watch } from 'vue'

const ACTIVE = 'tmpl-footnote-active'

export function useFootnoteHighlight(root: { value: HTMLElement | null }) {
  const { $clicks } = useSlideContext()
  const { currentPage } = useNav()

  function clearActive() {
    const slide = root.value?.parentElement
    if (!slide) return
    for (const lit of slide.querySelectorAll(`.${ACTIVE}`)) lit.classList.remove(ACTIVE)
  }

  function onClick(event: MouseEvent) {
    const slide = root.value?.parentElement
    if (!slide) return
    clearActive()

    const link = (event.target as Element | null)?.closest?.('.footnote-ref a')
    if (!link || !slide.contains(link)) return

    event.preventDefault()
    // Slidev ignores its shortcuts while a link holds focus.
    ;(link as HTMLElement).blur()

    const id = link.getAttribute('href')?.slice(1)
    if (!id) return
    // Note ids repeat across slides, so look inside this one.
    slide.querySelector(`#${CSS.escape(id)}`)?.classList.add(ACTIVE)
  }

  // A slide stays mounted after the deck moves on.
  watch([currentPage, $clicks], clearActive)

  onMounted(() => document.addEventListener('click', onClick))
  onUnmounted(() => document.removeEventListener('click', onClick))
}
