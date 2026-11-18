/* The site builds every deck into dist/t/<name>, which sits outside this deck,
   and Vite only empties an outDir it is told it may empty. */
export default {
  build: { emptyOutDir: true },
}
