<script setup lang="ts">
import PostSummaryCard from './post-summary-card.vue'

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
    <PostSummaryCard
      v-if="post.data"
      :id="post.data.id"
      :author="post.data.author"
      :title="post.data.title"
      :content="post.data.content"
      :ctime="post.data.ctime"
      @click="$emit('click', post.data.id, offset)"
    />
    <n-card
      v-else
      :style="{ height: holderHeight ? `${holderHeight}px` : 'auto' }"
    >
      <n-skeleton text :repeat="5" />
    </n-card>
  </div>
</template>
