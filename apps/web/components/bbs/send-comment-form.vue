<script setup lang="ts">
import type ActivityView from '../activity/view.vue'

import { BulbOutline as SendIcon } from '@vicons/ionicons5'
import { type FormInst, type FormRules, useThemeVars } from 'naive-ui'

import { screen } from '~/utils/screen'

defineProps<{
  sending: boolean
}>()

defineEmits<{
  (e: 'submit', content: string): void
}>()

const activityViewRef = ref<InstanceType<typeof ActivityView>>()
const { $text } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()
const themeVars = useThemeVars()
const triggerSize = computed(() => (screen.gt.sm.value ? 'large' : 'small'))

const formRef = ref<FormInst | null>(null)
const model = ref({
  content: '',
})
const formRules = {
  content: {
    required: true,
    trigger: [ 'input', 'blur' ],
    validator(_, value: string) {
      if (value.length > runtimeConfig.public.BBS.CONTENT_MAX_LENGTH) {
        return new Error(
          $text.contentMaxLenError({
            length: runtimeConfig.public.BBS.CONTENT_MAX_LENGTH,
          }),
        )
      }
      if (value.length < runtimeConfig.public.BBS.CONTENT_MIN_LENGTH) {
        return new Error(
          $text.contentMinLenError({
            length: runtimeConfig.public.BBS.CONTENT_MIN_LENGTH,
          }),
        )
      }
    },
  },
} satisfies FormRules

function clear() {
  model.value.content = ''
}

defineExpose({
  clear,
  toggle() {
    activityViewRef.value?.toggle()
  },
})

const triggerX = ref(0)
const triggerY = ref(0)
const triggerHeight = ref(0)
const triggerWidth = ref(0)
watch([ triggerWidth, triggerHeight ], ([ w, h ]) => {
  if (!window)
    return
  const { innerHeight, innerWidth } = window
  triggerX.value = innerWidth - w
  triggerY.value = (innerHeight - h) * 0.75
})
</script>

<template>
  <ActivityLayout
    ref="activityViewRef"
    v-model:trigger-x="triggerX"
    v-model:trigger-y="triggerY"
    v-model:trigger-height="triggerHeight"
    v-model:trigger-width="triggerWidth"
    :label="$text.comment()"
    :trigger="{
      color: themeVars.primaryColor,
      bordered: true,
      size: triggerSize,
      position: 'right',
    }"
  >
    <template #icon>
      <SendIcon />
    </template>
    <n-card embedded>
      <n-form ref="formRef" :model="model" :rules="formRules">
        <n-form-item path="content" :label="$text.content()">
          <n-input
            v-model:value="model.content"
            show-count
            clearable
            :minlength="$config.public.BBS.CONTENT_MIN_LENGTH"
            :maxlength="$config.public.BBS.CONTENT_MAX_LENGTH"
            type="textarea"
            :autosize="{
              minRows: 3,
              maxRows: screen.gt.md.value ? 20 : 10,
            }"
          />
        </n-form-item>
        <div class="flex justify-end gap-x-2">
          <n-popconfirm @positive-click="clear">
            <template #trigger>
              <n-button round>
                {{ $text.clearAll() }}
              </n-button>
            </template>
            {{ $text.clearAllConfirmMsg() }}
          </n-popconfirm>
          <n-button
            :disabled="!model.content"
            round
            type="primary"
            :loading="sending"
            @click="$emit('submit', model.content)"
          >
            {{ $text.send_post() }}
          </n-button>
        </div>
      </n-form>
    </n-card>
  </ActivityLayout>
</template>
