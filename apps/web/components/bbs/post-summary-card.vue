<script setup lang="ts">
import type { Dayjs } from 'dayjs'

import md from '@repo/markdown'

defineProps<{
  id: number
  author: {
    id: number
    username: string
  }
  title: string
  content: string
  ctime: Dayjs
}>()

defineEmits<{
  (e: 'click', id: number): void
}>()
</script>

<template>
  <n-card content-class="p-x-4!" size="small">
    <n-thing content-class="m-0!">
      <template #avatar>
        <n-avatar :size="24" color="#ee7623" class="select-none">
          {{ author.username.slice(0, 1) }}
        </n-avatar>
      </template>
      <template #header>
        {{ author.username }}
      </template>

      <div class="flex flex-col gap-y-2">
        <div @click="$emit('click', id)">
          <n-ellipsis
            class="text-1.2rem font-600 hover:cursor-pointer hover:text-[#ee7623]"
            :tooltip="false"
            :line-clamp="1"
          >
            <span class="select-none font-700 text-1.25rem"># </span>{{ title }}
          </n-ellipsis>
        </div>
        <n-ellipsis line-clamp="1" :tooltip="false">
          <div v-html="md.render(content)" />
        </n-ellipsis>
      </div>

      <template #footer>
        <span class="text-12px font-thin">
          {{ ctime.format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </template>
    </n-thing>
  </n-card>
</template>
