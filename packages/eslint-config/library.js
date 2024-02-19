const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: [
    'eslint:recommended',
    'prettier',
    'eslint-config-turbo',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    './imports.js',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['node', 'promise'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    'node_modules/',
    'dist/',
  ],
  rules: {
    'no-unused-vars': 'off',
    'promise/always-return': 0,
    'no-console': 'error',
    'promise/no-nesting': 0,
  },
});
