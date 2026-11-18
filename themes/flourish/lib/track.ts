export function track(cells: number | string | undefined, fit: string) {
  if (cells == null) return null
  return cells === 'auto' ? fit : `calc(${Number(cells)} * var(--tmpl-cell))`
}
