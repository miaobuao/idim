/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ['apps/**', 'packages/**'],
  extends: ['@repo/eslint-config/library.js'],
  parserOptions: {
    project: true,
  },
};
