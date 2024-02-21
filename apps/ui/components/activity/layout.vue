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
  <draggable
    v-show="!hidden"
    class="fixed select-none z-31 w-300px"
    :handle="draggableBarRef"
    :prevent-default="true"
    storage-key="activity-window-position"
    storage-type="local"
    :initial-value="windowInitialPosition"
  >
    <n-card ref="windowRef" class="h-full w-full" content-class="p-0!">
      <n-layout-header class="flex justify-around">
        <div></div>
        <div
          ref="draggableBarRef"
          class="h-2 mt-1.5 rounded bg-green w-180px cursor-move"
        ></div>
        <n-button text @click="hidden = true">
          <template #icon> <MinimizeIcon /> </template>
        </n-button>
      </n-layout-header>
      <n-layout-content>
        <slot name="window"></slot>
      </n-layout-content>
    </n-card>
  </draggable>
</template>

<script setup lang="ts">
import { ChevronDownOutline as MinimizeIcon } from '@vicons/ionicons5';
import { UseDraggable as Draggable } from '@vueuse/components';
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

const draggableBarRef = ref<HTMLElement>();
const windowRef = ref<HTMLElement>();

// const { style: windowStyle, x: windowX, y: windowY } = useDraggable(windowRef);
// watch(
//   hidden,
//   (hidden) => {
//     if (hidden) return;
//     nextTick(() => {
//       if (!windowRef.value) return;
//       const { clientHeight, clientWidth } = windowRef.value;
//       windowX.value = (window.innerWidth - clientWidth) / 2;
//       windowY.value = (window.innerHeight - clientHeight) / 2;
//     });
//   },
//   {
//     immediate: true,
//   }
// );

const windowInitialPosition = reactive({ x: 100, y: 100 });
onMounted(() => {
  const { innerHeight, innerWidth } = window;
  triggerX.value = innerWidth - triggerRef.value!.clientWidth;
  triggerY.value = (innerHeight * 2) / 3;

  const { clientHeight, clientWidth } = windowRef.value!;
  windowInitialPosition.x = (window.innerWidth - clientWidth) / 2;
  windowInitialPosition.y = (window.innerHeight - clientHeight) / 2;
});
</script>
