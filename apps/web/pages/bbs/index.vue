<script setup lang="ts">
import type { VirtualListInst } from 'naive-ui'
import type { CreatePostType } from '~/server/trpc/modules/post'

import { buildLanguageSource } from '@repo/locales'
import { isArray, mean } from 'lodash-es'

import BbsSendPostForm from '~/components/bbs/send-post-form.vue'

const ITEM_SIZE = 156
const user = useUserStore()
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
      message.next({
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

const lastViewedPostOffsets = useState<number[]>(
  'lastViewedPostOffset',
  () => [],
)
let freezed = true
const virtualListInst = ref<VirtualListInst>()
onBeforeMount(async () => {
  freezed = true
  posts.refresh()
})
onMounted(() => {
  try {
    if (lastViewedPostOffsets.value.length > 0) {
      const key = Math.ceil(
        mean(lastViewedPostOffsets.value) - window.innerHeight / ITEM_SIZE / 2,
      )
      virtualListInst.value?.scrollTo({
        key: key.toString(),
      })
    }
  }
  finally {
    freezed = false
  }
})
onBeforeUnmount(() => {
  freezed = true
})

function pushViewing(offset: number) {
  if (freezed)
    return
  lastViewedPostOffsets.value = [ ...lastViewedPostOffsets.value, offset ]
}
function removeViewing(offset: number) {
  if (freezed)
    return
  lastViewedPostOffsets.value = lastViewedPostOffsets.value.filter(
    v => v !== offset,
  )
}
definePageMeta({
  keepalive: true,
})
</script>

<template>
  <BbsSendPostForm
    v-if="user.self.username"
    ref="sendForm"
    :sending="sending"
    @submit="sendPost"
  />
  <n-virtual-list
    ref="virtualListInst"
    class="bbs_posts-list"
    :item-size="ITEM_SIZE"
    :items="items"
    item-resizable
  >
    <template #default="{ item }">
      <bbs-post-list-item
        :holder-height="156"
        class="m-1"
        :offset="item.offset"
        @vue:mounted="pushViewing(item.offset)"
        @vue:unmounted="removeViewing(item.offset)"
        @click="(id) => $router.push(`bbs/${id}`)"
      />
    </template>
  </n-virtual-list>
</template>
