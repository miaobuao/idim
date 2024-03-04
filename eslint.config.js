import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    vue: true,
    unocss: true,
    ignores: [
      '**/.nuxt',
      '**/.output',
    ],
    formatters: {
      css: true,
      html: true,
      markdown: true,
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  {
    files:["apps/ui/**"],
    rules: {
      'node/prefer-global/process': 0,
    }
  },
  {
    rules: {
      'ts/no-use-before-define': 0,
      'ts/ban-ts-comment': 0,
      'no-var': 0,
      'vars-on-top': 0,
      'block-scoped-var': 0,
      'ts/no-namespace': 0,
      'import/order': [
        'error',
        {
          'groups': [
            'type',
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index', 'object', 'unknown'],
          ],
          'pathGroupsExcludedImportTypes': ['builtin'],
          'newlines-between': 'always',
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
)
