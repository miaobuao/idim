<script setup lang="ts">
defineProps<{
  trigger: {
    label?: string
    color?: string
    bordered?: boolean
    size?: string
    class?: string
  }
}>()
</script>

<template>
  <ActivityLayout>
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
