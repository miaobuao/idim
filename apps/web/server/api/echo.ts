export default defineEventHandler(() => {
  return [useRuntimeConfig(), process.env]
})
