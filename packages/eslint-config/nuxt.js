const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  ignorePatterns: ['node_modules/', 'dist/', '.nuxt/', '.output/'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 13,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['vue', 'node', 'promise'],
  extends: [
    'plugin:vue/vue3-recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    './imports.js',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'off',
    'promise/always-return': 0,
    'no-console': 'error',
  },
});
