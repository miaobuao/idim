<script setup lang="ts">
import { CloseOutline as MinimizeIcon } from '@vicons/ionicons5'
import { useDraggable } from '@vueuse/core'
import { useThemeVars } from 'naive-ui'

const hidden = ref(false)

const themeVars = useThemeVars()

defineExpose({
  toggle() {
    hidden.value = !hidden.value
  },
})

function toggleHidden() {
  hidden.value = !hidden.value
}

const triggerRef = ref<HTMLElement>()
const { position: triggerPosition, y: triggerY } = useDraggable(triggerRef, {
  onMove({ y }) {
    const { clientHeight: h } = triggerRef.value!
    const { innerHeight } = window
    triggerY.value = Math.max(Math.min(y, innerHeight - h), 0)
  },
})

const triggerStyle = computed(
  () => `right:0px;top:${triggerPosition.value.y}px`,
)

const windowRef = ref<HTMLElement>()
const draggableBarRef = ref<HTMLElement>()
const { x: windowX, y: windowY } = useDraggable(windowRef, {
  handle: draggableBarRef,
  onMove({ x, y }) {
    const { clientWidth: w, clientHeight: h } = windowRef.value!
    const { innerWidth, innerHeight } = window
    windowX.value = Math.max(Math.min(x, innerWidth - w), 0)
    windowY.value = Math.max(Math.min(y, innerHeight - h), 0)
  },
})

onMounted(() => {
  nextTick(() => {
    hidden.value = true
  })
  const { innerHeight, innerWidth } = window
  triggerY.value = (innerHeight * 2) / 3

  const { clientHeight, clientWidth } = windowRef.value!
  windowX.value = (innerWidth - clientWidth) / 2
  windowY.value = (innerHeight - clientHeight) / 2

  window.addEventListener('resize', () => {
    if (!windowRef.value)
      return
    const { innerHeight, innerWidth } = window
    const { clientWidth: windowWidth, clientHeight: windowHeight }
      = windowRef.value

    const windowRight = windowX.value + windowWidth
    const windowBottom = windowY.value + windowHeight
    if (windowRight > innerWidth)
      windowX.value = innerWidth - windowRef.value!.clientWidth

    if (windowBottom > innerHeight)
      windowY.value = innerHeight - windowRef.value!.clientHeight
  })
})
</script>

<template>
  <div
    v-show="hidden"
    v-click="toggleHidden"
    class="fixed select-none cursor-move z-31"
    :style="triggerStyle"
  >
    <div ref="triggerRef" style="touch-action: none">
      <slot name="trigger" />
    </div>
  </div>
  <div
    v-show="!hidden"
    ref="windowRef"
    class="fixed select-none z-31 md:w-300px lg:w-500px xl:w-600px min-w-200px"
    :style="{
      left: `${windowX}px`,
      top: `${windowY}px`,
      ...(windowRef?.clientHeight === undefined
        ? {}
        : { maxHeight: `calc(100vh - ${windowY}px)` }),
    }"
    style="touch-action: none"
  >
    <n-card class="h-full w-full" content-class="p-0!">
      <n-layout-header class="flex justify-around">
        <div />
        <div
          ref="draggableBarRef"
          style="touch-action: none"
          :style="`background-color:${themeVars.primaryColor}`"
          class="cursor-move h-2.5 my-1 rounded w-80% hover:pa-0.4"
        />
        <n-button text @click="toggleHidden">
          <template #icon>
            <MinimizeIcon />
          </template>
        </n-button>
      </n-layout-header>
      <n-layout-content :native-scrollbar="false">
        <slot name="window" />
      </n-layout-content>
    </n-card>
  </div>
</template>
