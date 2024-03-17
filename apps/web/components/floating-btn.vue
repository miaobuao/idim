<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate'
import { useDraggable, useResizeObserver } from '@vueuse/core'
import { clamp, debounce } from 'lodash-es'
import { NButton } from 'naive-ui'

export interface FloatingBtnProps {
  bound?: {
    x: [number, number]
    y: [number, number]
  }
  position?:
    | 'left'
    | 'right'
    | 'bottom'
    | 'top'
    | 'left-top'
    | 'right-top'
    | 'right-bottom'
    | 'left-bottom'
}
const props = defineProps<FloatingBtnProps>()
defineEmits<{
  (e: 'click'): void
}>()
const x = defineModel<number>('x')
const y = defineModel<number>('y')
const width = defineModel<number>('width')
const height = defineModel<number>('height')

const triggerRef = ref<HTMLElement>()
useResizeObserver(triggerRef, (e) => {
  width.value = e[0].contentRect.width
  height.value = e[0].contentRect.height
})
const {
  position,
  y: triggerY,
  x: triggerX,
} = useDraggable(triggerRef, {
  onMove({ x, y }) {
    const [ nx, ny ] = clampBound(x, y)
    triggerX.value = nx
    triggerY.value = ny
  },
})

watch(position, (position) => {
  x.value = position.x
  y.value = position.y
})

const onResize = debounce(() => {
  if (!x.value || !y.value)
    return
  const [ nx, ny ] = clampBound(x.value, y.value)
  x.value = nx
  y.value = ny
}, 50)

function clampBound(x: number, y: number): [number, number] {
  const { innerHeight, innerWidth } = window
  switch (props.position) {
    case 'left':
      return [
        0,
        clamp(y, ...(props.bound?.y ?? [ 0, innerHeight - (height.value ?? 0) ])),
      ]
    case 'right':
      return [
        innerWidth - (width.value ?? 0),
        clamp(y, ...(props.bound?.y ?? [ 0, innerHeight - (height.value ?? 0) ])),
      ]
    case 'bottom':
      return [
        clamp(x, ...(props.bound?.x ?? [ 0, innerWidth - (width.value ?? 0) ])),
        innerHeight - (height.value ?? 0),
      ]
    case 'top':
      return [
        clamp(x, ...(props.bound?.x ?? [ 0, innerWidth - (width.value ?? 0) ])),
        0,
      ]
    case 'left-top':
      return [ 0, 0 ]
    case 'right-top':
      return [ innerWidth - (width.value ?? 0), 0 ]
    case 'right-bottom':
      return [
        innerWidth - (width.value ?? 0),
        innerHeight - (height.value ?? 0),
      ]
    case 'left-bottom':
      return [ 0, innerHeight - (height.value ?? 0) ]
    default:
      return [
        clamp(x, ...(props.bound?.x ?? [ 0, innerWidth - (width.value ?? 0) ])),
        clamp(y, ...(props.bound?.y ?? [ 0, innerHeight - (height.value ?? 0) ])),
      ]
  }
}

const showLabel = ref(false)
const useAnimation = ref(true)
onMounted(() => {
  window.addEventListener('resize', onResize)
  setTimeout(() => {
    showLabel.value = true
    setTimeout(() => {
      showLabel.value = false
    }, 2000)
  }, 500)
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div
    v-click="() => $emit('click')"
    class="fixed select-none cursor-move z-31"
    :style="{
      left: `${x}px`,
      top: `${y}px`,
    }"
    @mouseenter="useAnimation = false"
  >
    <div ref="triggerRef" style="touch-action: none">
      <NButton v-if="useAnimation" v-auto-animate v-bind="$attrs">
        <template #icon>
          <slot name="icon" />
        </template>
        <slot v-if="showLabel" />
      </NButton>

      <NButton v-else v-bind="$attrs">
        <template #icon>
          <slot name="icon" />
        </template>
      </NButton>
    </div>
  </div>
</template>
