<script setup lang="ts">
import md from '@repo/markdown'

import { screen } from '~/utils/screen'

const route = useRoute()
const pid = computed(() => Number.parseInt(route.params.pid as string))
const posts = usePostsStore()
const query = computed(() => {
  return posts.get(pid.value)
})
onUnmounted(() => {
  query.value.abort()
})
const data = computed(() => query.value.data.value)
const cardSize = computed(() => (screen.gt.md ? 'medium' : 'small'))

const { $trpc } = useNuxtApp()
const links = $trpc.post.getComments.useQuery(pid)
</script>

<template>
  <n-card class="m-2" :size="cardSize" :title="data?.title">
    <n-skeleton v-if="!data" :repeat="10" text />

    <n-thing v-else content-class="m-0!">
      <template #avatar>
        <avatar color="#ee7623" :size="25">
          {{ data?.author.username.slice(0, 1) }}
        </avatar>
      </template>
      <template #header>
        <n-ellipsis line-clamp="1" :tooltip="false">
          {{ data?.author.username }}
        </n-ellipsis>
      </template>

      <p class="font-thin text-0.8rem op80">
        {{
          data.mtime.diff(data.ctime) > 0
            ? $text.updated_at_({
              time: data?.mtime.format('YYYY-MM-DD HH:mm:ss'),
            })
            : $text.published_at_({
              time: data?.ctime.format('YYYY-MM-DD HH:mm:ss'),
            })
        }}
      </p>

      <div v-html="md.render(data?.content)" />
    </n-thing>
  </n-card>

  <n-skeleton v-if="links.status.value === 'pending'" text :repeat="10" />
  <div
    v-else-if="links.data.value?.length ?? 0 > 0"
    class="m-2 flex flex-col gap-y-2"
  >
    <div class="text-1.2rem font-600 ml-2">
      {{ $text.comments() }} ({{ links.data.value?.length ?? 0 }})
    </div>
    <bbs-comment-list-item
      v-for="link in links.data.value"
      :id="link.id"
      :key="link.id"
      :author="link.comment.author"
      :content="link.comment.content"
      :mtime="link.comment.mtime"
    />
  </div>
</template>
