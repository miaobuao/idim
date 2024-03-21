<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    duration?: number
    interval?: number
    disabled?: boolean
  }>(),
  {
    duration: 60_000,
    interval: 1000,
    disabled: false,
  },
)
const emits = defineEmits<{
  (e: 'click', startCd: (value?: number) => void): void
}>()
const cd = defineModel('cd', {
  default: 0,
})

function onClick() {
  emits('click', (value) => {
    cd.value = value ?? props.duration
    const timer = setInterval(() => {
      cd.value = Math.max(0, cd.value - props.interval)
      if (cd.value === 0)
        clearInterval(timer)
    }, props.interval)
  })
}
</script>

<template>
  <n-button
    v-bind="$attrs"
    :disabled="cd > 0 || props.disabled"
    @click="onClick"
  >
    <slot />
  </n-button>
</template>
