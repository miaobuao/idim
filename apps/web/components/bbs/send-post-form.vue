<script setup lang="ts">
import type { CreatePostType } from '~/server/trpc/modules/post'

import { BulbOutline as SendIcon } from '@vicons/ionicons5'
import { type FormInst, type FormRules, useThemeVars } from 'naive-ui'

import ActivityView from '../activity/view.vue'
import { screen } from '~/utils/screen'

defineProps<{
  sending: boolean
}>()

const emits = defineEmits<{
  (e: 'submit', value: CreatePostType): void
}>()

const activityViewRef = ref<InstanceType<typeof ActivityView>>()
const runtimeConfig = useRuntimeConfig()
const { $text } = useNuxtApp()
const themeVars = useThemeVars()
const triggerSize = computed(() => (screen.gt.sm.value ? 'large' : 'small'))

const user = useUserStore()
const formRef = ref<FormInst | null>(null)
const model = ref<CreatePostType>({
  title: '',
  content: '',
})
const formRules = {
  title: {
    required: true,
    trigger: [ 'input', 'blur' ],
    validator(_, value: string) {
      if (value.length > runtimeConfig.public.BBS.TITLE_MAX_LENGTH) {
        return new Error(
          $text.titleMaxLenError({
            length: runtimeConfig.public.BBS.TITLE_MAX_LENGTH,
          }),
        )
      }
      if (value.length < runtimeConfig.public.BBS.TITLE_MIN_LENGTH) {
        return new Error(
          $text.titleMinLenError({
            length: runtimeConfig.public.BBS.TITLE_MIN_LENGTH,
          }),
        )
      }
    },
  },
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

function submit() {
  formRef.value?.validate(async (errors) => {
    if (!errors)
      emits('submit', model.value)
  })
}

function clearAll() {
  model.value = {
    title: '',
    content: '',
  }
}

defineExpose({
  clearAll,
  toggle() {
    activityViewRef.value?.toggle()
  },
})
</script>

<template>
  <ActivityView
    v-if="user.self.username"
    ref="activityViewRef"
    :trigger="{
      label: $text.send_post(),
      color: themeVars.primaryColor,
      bordered: true,
      size: triggerSize,
    }"
    bordered
  >
    <template #icon>
      <SendIcon />
    </template>

    <n-card embedded>
      <n-form ref="formRef" :model="model" :rules="formRules">
        <n-form-item path="title" :label="$text.title()">
          <n-input
            v-model:value="model.title"
            show-count
            :minlength="$config.public.BBS.TITLE_MIN_LENGTH"
            :maxlength="$config.public.BBS.TITLE_MAX_LENGTH"
          />
        </n-form-item>
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
          <n-popconfirm @positive-click="clearAll">
            <template #trigger>
              <n-button round>
                {{ $text.clearAll() }}
              </n-button>
            </template>
            {{ $text.clearAllConfirmMsg() }}
          </n-popconfirm>
          <n-button
            :disabled="!model.content || !model.title"
            round
            type="primary"
            :loading="sending"
            @click="submit"
          >
            {{ $text.send_post() }}
          </n-button>
        </div>
      </n-form>
    </n-card>
  </ActivityView>
</template>
