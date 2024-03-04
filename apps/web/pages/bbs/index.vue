<script setup lang="ts">
import { BulbOutline as SendIcon } from '@vicons/ionicons5'
import { type FormInst, useThemeVars } from 'naive-ui'

import { screen } from '#imports'

const themeVars = useThemeVars()
const triggerSize = computed(() => (screen.gt.sm.value ? 'large' : 'small'))

const formRef = ref<FormInst | null>(null)
const model = ref<Partial<PostForm>>({
  title: undefined,
  content: undefined,
})
const formRules = {
  title: {
    required: true,
    trigger: [ 'input', 'blur' ],
    message: 'Please input title',
  },
  content: {
    required: true,
    trigger: [ 'input', 'blur' ],
    message: 'Please input content',
  },
}

function submit() {}
</script>

<script lang="ts">
interface PostForm {
  title: string
  content: string
}
</script>

<template>
  bbs
  <activity-view
    :trigger="{
      label: $text.send_post(),
      color: themeVars.primaryColor,
      bordered: true,
      size: triggerSize,
    }"
    bordered
  >
    <template #icon>
      <n-icon>
        <SendIcon />
      </n-icon>
    </template>

    <n-card embedded>
      <n-form ref="formRef" :model="model" :rules="formRules">
        <n-form-item path="title" :label="$text.title()">
          <n-input v-model="model.title" />
        </n-form-item>
        <n-form-item path="content" :label="$text.content()">
          <n-input v-model="model.content" />
        </n-form-item>
        <div class="flex justify-end gap-x-2">
          <n-button round>
            reset
          </n-button>
          <n-button
            :disabled="!model.content"
            round
            type="primary"
            @click="submit"
          >
            Validate
          </n-button>
        </div>
      </n-form>
    </n-card>
  </activity-view>
</template>
