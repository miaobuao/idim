<script setup lang="ts">
defineProps<{
  size: number | 'small' | 'medium' | 'large'
  color: string
}>()
</script>

<template>
  <n-avatar :color="color" :size="size" v-bind="$attrs" class="select-none">
    <slot />
  </n-avatar>
</template>
