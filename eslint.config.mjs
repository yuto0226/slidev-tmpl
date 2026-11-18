import vue from 'eslint-plugin-vue'
import globals from 'globals'

const correctness = {
  'no-undef': 'error',
  'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
  'vue/multi-word-component-names': 'off',
}

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.venv/**',
      '**/.rumdl_cache/**',
      '**/*.ts',
      'themes/original/styles/fonts/**',
    ],
  },
  ...vue.configs['flat/essential'],
  {
    files: ['themes/original/**/*.vue'],
    languageOptions: { globals: { ...globals.browser, ...globals.es2022 } },
    rules: correctness,
  },
  {
    files: ['scripts/**/*.mjs', 'site/**/*.mjs', '_lab/**/*.mjs'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser, ...globals.es2022 },
    },
    rules: correctness,
  },
]
