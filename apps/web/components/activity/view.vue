<script setup lang="ts">
import type Layout from './layout.vue'

defineProps<{
  trigger: {
    label?: string
    color?: string
    bordered?: boolean
    size?: string
    class?: string
  }
}>()

const layoutRef = ref<InstanceType<typeof Layout>>()

defineExpose({
  toggle() {
    layoutRef.value?.toggle()
  },
})
</script>

<template>
  <ActivityLayout ref="layoutRef">
    <template #trigger>
      <ActivityTrigger v-bind="trigger">
        <template #icon>
          <slot name="icon" />
        </template>
      </ActivityTrigger>
    </template>
    <template #window>
      <slot />
    </template>
  </ActivityLayout>
</template>
