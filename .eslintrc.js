/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ['apps/**'],
  extends: ['@repo/eslint-config/library.js'],
  parserOptions: {
    project: true,
  },
};
