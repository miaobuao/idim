<script setup lang="ts">
import type { VirtualListInst } from 'naive-ui'
import type { CreatePostType } from '~/server/trpc/modules/post'

import { buildLanguageSource } from '@repo/locales'
import { isArray } from 'lodash-es'

import BbsSendPostForm from '../../components/bbs/send-post-form.vue'

const sending = ref(false)
const sendForm = ref<InstanceType<typeof BbsSendPostForm> | null>(null)
const { $trpc, $text } = useNuxtApp()
const posts = usePostsStore()
const source = buildLanguageSource()
const items = computed(() =>
  Array.from({ length: posts.total }).map((_, i) => ({
    offset: posts.total - i - 1,
    key: `${posts.total - i - 1}`,
  })),
)
function sendPost(data: CreatePostType) {
  sending.value = true
  $trpc.post.create
    .mutate(data)
    .then(() => {
      pubMessage({
        type: 'success',
        content: $text.send_succ(),
        duration: 3000,
      })
      posts.refresh()
      sendForm.value?.clearAll()
      sendForm.value?.toggle()
    })
    .catch(handleSendPostError)
    .finally(() => {
      sending.value = false
    })
}

function handleSendPostError(e: any) {
  if (!e.message)
    return errorHandler(e)
  const msg = JSON.parse(e.message)
  if (!isArray(msg))
    return errorHandler(e)

  const config = useRuntimeConfig()
  const publish = createPubNotify({
    type: 'error',
    duration: 2000,
  })
  msg.forEach(({ message }) => {
    switch (message) {
      case source.titleMaxLenError:
        return publish({
          content: $text.titleMaxLenError({
            length: config.public.BBS.TITLE_MAX_LENGTH,
          }),
        })

      case source.titleMinLenError:
        return publish({
          content: $text.titleMinLenError({
            length: config.public.BBS.TITLE_MIN_LENGTH,
          }),
        })

      case source.contentMinLenError:
        return publish({
          content: $text.contentMinLenError({
            length: config.public.BBS.CONTENT_MIN_LENGTH,
          }),
        })

      case source.contentMaxLenError:
        return publish({
          content: $text.contentMaxLenError({
            length: config.public.BBS.CONTENT_MAX_LENGTH,
          }),
        })

      default:
        return trpcErrorMessageHandler(message)
    }
  })
}

const router = useRouter()
const lastClickedPostOffset = useState('lastClickedPostOffset', () => 0)
function onClick(id: number, offset: number) {
  lastClickedPostOffset.value = offset
  router.push(`/bbs/${id}`)
}

const virtualListInst = ref<VirtualListInst>()
onMounted(() => {
  virtualListInst.value?.scrollTo({
    key: Math.max(0, lastClickedPostOffset.value - 2).toString(),
  })
})
onBeforeMount(() => {
  posts.refresh()
})

definePageMeta({
  keepalive: true,
})
</script>

<template>
  <BbsSendPostForm ref="sendForm" :sending="sending" @submit="sendPost" />
  <n-virtual-list
    ref="virtualListInst"
    class="bbs_posts-list"
    :item-size="156"
    :items="items"
    item-resizable
  >
    <template #default="{ item }">
      <BbsPostListItem
        :holder-height="156"
        class="m-1"
        :offset="item.offset"
        @click="onClick"
      />
    </template>
  </n-virtual-list>
</template>
