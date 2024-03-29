<script setup lang="ts">
import type { inferProcedureOutput } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/router'

import { useThemeVars } from 'naive-ui'

const user = useUserStore()
const { $trpc } = useNuxtApp()

const currentPage = ref(0)
const pageSize = ref(20)
const themeVars = useThemeVars()

function useReq() {
  if (currentPage.value === -1)
    return
  return $trpc.post.get
    .query({
      authorId: user.self.id,
      pageSize: pageSize.value,
      pageIndex: currentPage.value,
      reverse: true,
    })
    .then((items) => {
      items.forEach(item =>
        posts.push(
          item as Omit<typeof item, 'ctime' | 'mtime'> & {
            ctime: Date
            mtime: Date
          },
        ),
      )
      currentPage.value++
      if (items.length < pageSize.value)
        currentPage.value = -1
    })
}

const posts = reactive<inferProcedureOutput<AppRouter['post']['get']>>([])

onMounted(() => {
  useReq()
})
</script>

<template>
  <div class="flex flex-col px-[20px] gap-y-[2rem]">
    <n-card content-class="p-0! px-[20px]!" class="mt-[20px]">
      <div class="flex justify-between">
        <avatar
          :style="{
            transform: 'translateY(-25%)',
          }"
        >
          {{ user.self.username.slice(0, 1) }}
        </avatar>
        <div class="flex justify-around items-center gap-x-[1rem] mt-xs">
          <div class="op-50 text-[14px] leading-[14px]">
            ID: {{ user.self.id }}
          </div>
          <div />
        </div>
      </div>

      <div class="flex justify-between">
        <div class="font-semibold">
          {{ user.self.username }}
        </div>
      </div>
      <div class="my-[0.5rem] op-80">
        {{ $text.ctime() }}: {{ user.self.ctime.format('YYYY-MM-DD') }}
      </div>
    </n-card>

    <div class="flex flex-col relative gap-y-[1.5rem]">
      <div
        class="absolute h-full op-50 ml-[30px] w-[2px]"
        :style="{
          backgroundColor: themeVars.primaryColor,
        }"
      />
      <bbs-post-summary-card
        v-for="post in posts"
        :id="post.id"
        :key="post.id"
        :author="post.author"
        :title="post.title"
        :content="post.content"
        :ctime="dayjs(post.ctime)"
        @click="(id) => $router.push(`/bbs/${id}`)"
      />
    </div>
  </div>
</template>
