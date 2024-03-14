<script setup lang="ts">
import { screen } from '~/utils/screen'

const route = useRoute()

const posts = usePostsStore()
const data = computed(() => {
  const pid = Number.parseInt(route.params.pid as string)
  return posts.get(pid).value
})
const cardSize = computed(() => (screen.gt.md ? 'medium' : 'small'))
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

      <div>
        {{ data?.content }}
      </div>
    </n-thing>
  </n-card>

  <n-card class="m-2" :size="cardSize" :title="$text.comments()" />
</template>
