<script setup lang="ts">
import md from '@repo/markdown'

const props = defineProps<{
  offset: number
  holderHeight?: number
}>()

defineEmits<{
  (e: 'click', id: number, offset: number): void
}>()

const posts = usePostsStore()
const { data: post, abort } = posts.getByOffset(props.offset)

onUnmounted(() => {
  abort()
})
</script>

<template>
  <div v-bind="$attrs">
    <n-card v-if="post.data" content-class="p-x-4!" size="small">
      <n-thing content-class="m-0!">
        <template #avatar>
          <n-avatar :size="24" color="#ee7623" class="select-none">
            {{ post.data.author.username.slice(0, 1) }}
          </n-avatar>
        </template>
        <template #header>
          {{ post.data.author.username }}
        </template>

        <div class="flex flex-col gap-y-2">
          <div @click="$emit('click', post.data.id, offset)">
            <n-ellipsis
              class="text-1.2rem font-600 hover:cursor-pointer hover:text-[#ee7623]"
              :tooltip="false"
              :line-clamp="1"
            >
              <span class="select-none font-700 text-1.25rem"># </span>{{ post.data.title }}
            </n-ellipsis>
          </div>
          <n-ellipsis line-clamp="1" :tooltip="false">
            <div v-html="md.render(post.data.content)" />
          </n-ellipsis>
        </div>

        <template #footer>
          <span class="text-12px font-thin">
            {{ post.data.ctime.format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </template>
      </n-thing>
    </n-card>

    <n-card
      v-else
      :style="{ height: holderHeight ? `${holderHeight}px` : 'auto' }"
    >
      <n-skeleton text :repeat="5" />
    </n-card>
  </div>
</template>
