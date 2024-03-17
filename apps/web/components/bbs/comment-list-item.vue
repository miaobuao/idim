<script setup lang="ts">
import type dayjs from 'dayjs'

import md from '@repo/markdown'

export interface CommentProps {
  id: number
  author: { username?: string, id: number }
  content: string
  mtime: dayjs.Dayjs
}

const props = defineProps<CommentProps>()

const user = useUserStore()
const username = computed(() =>
  props.author.username === undefined
    ? user.getInfo(props.author.id).data.value?.username
    : props.author.username,
)
</script>

<template>
  <n-card v-bind="$attrs" content-class="pb-0!">
    <n-thing content-class="m-0!">
      <template #avatar>
        <avatar color="#ee7623" size="small">
          {{ username?.slice(0, 1) }}
        </avatar>
      </template>
      <template #header>
        <n-ellipsis :line-clamp="1" :tooltip="false">
          {{ username }}
        </n-ellipsis>
      </template>

      <n-ellipsis :line-clamp="3" :tooltip="false" expand-trigger="click">
        <div v-html="md.render(content)" />
      </n-ellipsis>

      <div class="op50 text-12px">
        {{ mtime.fromNow() }}
      </div>
    </n-thing>
  </n-card>
</template>
