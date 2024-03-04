<template>
  <ActivityLayout>
    <template #trigger>
      <ActivityTrigger v-bind="trigger">
        <template #icon>
          <slot name="icon"></slot>
        </template>
      </ActivityTrigger>
    </template>
    <template #window>
      <slot></slot>
    </template>
  </ActivityLayout>
</template>

<script setup lang="ts">
defineProps<{
  trigger: {
    label?: string;
    color?: string;
    bordered?: boolean;
    size?: string;
    class?: string;
  };
}>();
</script>
