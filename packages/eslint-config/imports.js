const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  plugins: ['import', 'unused-imports'],
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          'type',
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index', 'object', 'unknown'],
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
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
});
