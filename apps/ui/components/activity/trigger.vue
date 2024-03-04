<template>
  <!-- <n-tag round v-bind="$attrs" @mouseenter="onHover" @mouseleave="onLeave">
    <template v-if="!hideLabel">
      {{ label }}
    </template>
    <template #avatar>
      <slot name="icon"></slot>
    </template>
  </n-tag> -->
  <n-button v-bind="$attrs" @mouseenter="onHover" @mouseleave="onLeave">
    <template #icon>
      <n-icon>
        <slot name="icon"></slot>
      </n-icon>
    </template>
    <template v-if="!hideLabel">
      {{ label }}
    </template>
  </n-button>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
}>();

const hideLabel = ref(true);
let timer: number | undefined;
function onHover() {
  clearTimeout(timer);
  timer = undefined;
  hideLabel.value = false;
}
function onLeave() {
  timer = setTimeout(() => {
    hideLabel.value = true;
  }, 500) as unknown as number;
}
</script>
