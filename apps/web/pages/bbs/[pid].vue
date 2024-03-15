<script setup lang="ts">
import type { CommentProps } from '~/components/bbs/comment-list-item.vue'

import md from '@repo/markdown'

import BbsSendCommentForm from '@/components/bbs/send-comment-form.vue'
import { screen } from '~/utils/screen'
import { useTrpc } from '~/utils/uses'

const route = useRoute()
const user = useUserStore()
const sending = ref(false)
const editingRef = ref<typeof BbsSendCommentForm>()
const pid = Number.parseInt(route.params.pid as string)
const posts = usePostsStore()
const query = posts.get(pid)

onUnmounted(() => {
  query.abort()
})
const data = computed(() => query.data.value)
const cardSize = computed(() => (screen.gt.md ? 'medium' : 'small'))

const $trpc = useTrpc()
const $text = useText()
const links = $trpc.comment.getAll.useQuery({ postId: pid })
const comments = ref<CommentProps[]>([])

watch(links.data, (value) => {
  if (!value)
    return
  comments.value = value.map(d => ({
    id: d.id,
    author: d.comment.author,
    content: d.comment.content,
    mtime: d.comment.mtime,
  }))
})

function sendComment(content: string) {
  $trpc.comment.create
    .mutate({
      content,
      postId: pid,
    })
    .then((d) => {
      editingRef.value?.clear()
      editingRef.value?.toggle()
      pubNotify({
        type: 'success',
        duration: 1000,
        content: $text.send_succ(),
      })
      comments.value = [
        {
          ...d,
          author: { id: d.authorId },
        },
        ...comments.value,
      ]
    })
    .catch(errorHandler)
}
</script>

<template>
  <BbsSendCommentForm
    v-if="user.self.username"
    ref="editingRef"
    :sending="sending"
    @submit="sendComment"
  />
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
      v-for="comment in comments"
      :id="comment.id"
      :key="comment.id"
      :author="comment.author"
      :content="comment.content"
      :mtime="comment.mtime"
    />
  </div>
</template>
