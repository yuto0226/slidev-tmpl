// The index names its own faces rather than inheriting whichever theme sorts
// first, so adding a theme cannot restyle this page. The build copies the
// chunks named by slug and declares the family it just copied, so an
// unshipped face cannot be asked for and a shipped one cannot be misspelled.
export const indexFonts = [
  { role: 'sans', theme: 'original', slug: 'gensenrounded-tw-700', family: 'GenSenRounded TW' },
  { role: 'mono', theme: 'original', slug: 'maple-mono-cn-400', family: 'Maple Mono CN' },
]
