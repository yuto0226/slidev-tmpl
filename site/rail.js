// No browser lets CSS ask which theme is in view.
const links = new Map([...document.querySelectorAll('.rail a')].map((a) => [a.hash.slice(1), a]))
const order = [...links.keys()]
const open = new Set()

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) open.add(entry.target.id)
      else open.delete(entry.target.id)
    }
    const current = order.find((id) => open.has(id))
    for (const [id, a] of links) {
      if (id === current) a.setAttribute('aria-current', 'true')
      else a.removeAttribute('aria-current')
    }
  },
  { rootMargin: '-45% 0px -45% 0px' },
)

for (const theme of document.querySelectorAll('.theme')) observer.observe(theme)
