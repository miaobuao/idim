<template>
  <div
    v-show="hidden"
    ref="triggerRef"
    p="x-4 y-2"
    shadow="~ hover:lg"
    class="fixed bg-$vp-c-bg select-none cursor-move z-31"
    style="touch-action: none"
    :style="triggerStyle"
    @click="hidden = false"
  >
    <slot name="trigger"></slot>
  </div>
  <div
    ref="windowRef"
    class="fixed select-none z-31 md:w-300px lg:w-400px xl:w-500px min-w-200px"
    :style="windowStyle"
    style="touch-action: none"
  >
    <n-card class="h-full w-full" content-class="p-0!">
      <n-layout-header class="flex justify-around">
        <div></div>
        <div
          ref="draggableBarRef"
          style="touch-action: none"
          class="h-2 mt-1.5 rounded bg-green w-80% cursor-move"
        ></div>
        <n-button text @click="hidden = true">
          <template #icon> <MinimizeIcon /> </template>
        </n-button>
      </n-layout-header>
      <n-layout-content>
        <slot name="window"></slot>
      </n-layout-content>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownOutline as MinimizeIcon } from '@vicons/ionicons5';
import { useDraggable } from '@vueuse/core';
const hidden = ref(true);

const triggerRef = ref<HTMLElement>();
const {
  style: triggerStyle,
  x: triggerX,
  y: triggerY,
} = useDraggable(triggerRef, {
  onMove({ y }) {
    const { clientWidth: w, clientHeight: h } = triggerRef.value!;
    const { innerWidth, innerHeight } = window;
    triggerX.value = innerWidth - w;
    if (y > innerHeight - h) {
      triggerY.value = innerHeight - h;
    }
    triggerY.value = Math.max(Math.min(y, innerHeight - h), 0);
  },
});

const windowRef = ref<HTMLElement>();
const draggableBarRef = ref<HTMLElement>();
const { x: windowX, y: windowY } = useDraggable(windowRef, {
  handle: draggableBarRef,
});
const windowStyle = computed(
  () => `left: ${windowX.value}px; top: ${windowY.value}px`
);

onMounted(() => {
  const { innerHeight, innerWidth } = window;
  triggerX.value = innerWidth - triggerRef.value!.clientWidth;
  triggerY.value = (innerHeight * 2) / 3;

  const { clientHeight, clientWidth } = windowRef.value!;
  windowX.value = (innerWidth - clientWidth) / 2;
  windowY.value = (innerHeight - clientHeight) / 2;

  window.addEventListener('resize', () => {
    if (!windowRef.value) return;
    const { innerHeight, innerWidth } = window;
    const { clientWidth: windowWidth, clientHeight: windowHeight } =
      windowRef.value;

    const windowRight = windowX.value + windowWidth;
    const windowBottom = windowY.value + windowHeight;
    if (windowRight > innerWidth) {
      windowX.value = innerWidth - windowRef.value!.clientWidth;
    }
    if (windowBottom > innerHeight) {
      windowY.value = innerHeight - windowRef.value!.clientHeight;
    }
  });
});
</script>
