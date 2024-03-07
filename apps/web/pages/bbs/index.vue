<script setup lang="ts">
import type { CreatePostType } from '~/server/trpc/modules/post'

import { buildLanguageSource } from '@repo/locales'
import { isArray } from 'lodash-es'

import BbsSendPostForm from '../../components/bbs/send-post-form.vue'

const sending = ref(false)
const sendForm = ref<InstanceType<typeof BbsSendPostForm> | null>(null)
const { $trpc, $text } = useNuxtApp()
const source = buildLanguageSource()

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
      sendForm.value?.clearAll()
      sendForm.value?.toggle()
    })
    .catch((e) => {
      if (e.message) {
        const msg = JSON.parse(e.message)
        if (isArray(msg)) {
          const config = useRuntimeConfig()
          msg.forEach(({ message }) => {
            if (message === source.titleMaxLenError) {
              pubNotify({
                type: 'error',
                duration: 2000,
                content: $text.titleMaxLenError({
                  length: config.public.BBS.TITLE_MAX_LENGTH,
                }),
              })
            }
            else if (message === source.titleMinLenError) {
              pubNotify({
                type: 'error',
                duration: 2000,
                content: $text.titleMinLenError({
                  length: config.public.BBS.TITLE_MIN_LENGTH,
                }),
              })
            }
            else if (message === source.contentMinLenError) {
              pubNotify({
                type: 'error',
                duration: 2000,
                content: $text.contentMinLenError({
                  length: config.public.BBS.CONTENT_MIN_LENGTH,
                }),
              })
            }
            else if (message === source.contentMaxLenError) {
              pubNotify({
                type: 'error',
                duration: 2000,
                content: $text.contentMaxLenError({
                  length: config.public.BBS.CONTENT_MAX_LENGTH,
                }),
              })
            }
            else {
              trpcErrorMessageHandler(message)
            }
          })
        }
      }
    })
    .finally(() => {
      sending.value = false
    })
}
</script>

<template>
  <BbsSendPostForm ref="sendForm" :sending="sending" @submit="sendPost" />
</template>
