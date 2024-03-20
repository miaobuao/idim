<script setup lang="ts">
import type { CommentProps } from '~/components/bbs/comment-list-item.vue'

import { vAutoAnimate } from '@formkit/auto-animate'
import md from '@repo/markdown'
import { SwapVerticalOutline as ReverseIcon } from '@vicons/ionicons5'
import { useThemeVars } from 'naive-ui'

import BbsSendCommentForm from '@/components/bbs/send-comment-form.vue'
import { screen } from '~/utils/screen'
import { useTrpc } from '~/utils/uses'

const route = useRoute()
const user = useUserStore()
const themeVars = useThemeVars()
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
const reversed = ref(false)
const links = $trpc.comment.getAll.useQuery({ postId: pid })
const comments = ref<CommentProps[]>([])
const sortedComments = computed(() => {
  if (reversed.value)
    return comments.value.toSorted((a, b) => a.mtime.diff(b.mtime))
  return comments.value.toSorted((a, b) => b.mtime.diff(a.mtime))
})
watch(links.data, (value) => {
  if (!value)
    return
  comments.value = value.map(d => ({
    id: d.commentId,
    author: d.comment.author,
    content: d.comment.content,
    mtime: dayjs(d.comment.mtime),
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
      notify.next({
        type: 'success',
        duration: 1000,
        content: $text.send_succ(),
      })
      comments.value = [
        {
          ...d,
          author: { id: d.authorId },
          mtime: dayjs(d.mtime),
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
  <n-card
    class="m-2"
    :size="cardSize"
    :title="data?.title"
    closable
    @close="$router.push({ name: 'bbs' })"
  >
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
    v-else-if="(links.data.value?.length ?? 0 > 0) || comments.length > 0"
    class="m-2 flex flex-col gap-y-2"
  >
    <div class="flex items-stretch text-1.2rem font-600 mx-2 justify-between">
      <div>{{ $text.comments() }} ({{ links.data.value?.length ?? 0 }})</div>
      <div :style="{ height: 'inhreit' }" class="flex flex-col justify-center">
        <n-icon
          :color="reversed ? themeVars.primaryColor : undefined"
          @click="reversed = !reversed"
        >
          <ReverseIcon />
        </n-icon>
      </div>
    </div>
    <div v-auto-animate class="flex flex-col gap-y-2">
      <bbs-comment-list-item
        v-for="comment in sortedComments"
        :id="comment.id"
        :key="comment.id"
        :author="comment.author"
        :content="comment.content"
        :mtime="comment.mtime"
      />
    </div>
  </div>
</template>
