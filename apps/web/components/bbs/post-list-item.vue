<script setup lang="ts">
const props = defineProps<{
  offset: number
  holderHeight?: number
}>()

const posts = usePostsStore()
const query = ref(posts.getByOffset(props.offset))
const post = computed(() => query.value.data)

watch(
  () => props.offset,
  (n, o) => {
    if (n !== o) {
      query.value.abort()
      query.value = posts.getByOffset(n) as unknown as typeof query.value
    }
  },
)
</script>

<template>
  <div v-bind="$attrs">
    <n-card v-if="post" content-class="p-x-4!" size="small">
      <n-thing content-class="m-0!">
        <template #avatar>
          <n-avatar :size="24" color="#ee7623" class="select-none">
            {{ post.author.username.slice(0, 1) }}
          </n-avatar>
        </template>
        <template #header>
          {{ post.author.username }}
        </template>

        <div class="flex flex-col gap-y-2">
          <div @click="$router.push(`/bbs/${post.id}`)">
            <n-ellipsis
              class="text-1.2rem font-600 hover:cursor-pointer hover:text-[#ee7623]"
              :tooltip="false"
              :line-clamp="1"
            >
              <span class="select-none font-700 text-1.25rem"># </span>{{ post.title }}
            </n-ellipsis>
          </div>
          <n-ellipsis
            line-clamp="1"
            :tooltip="false"
            class="leading-17.8px text-15px"
          >
            {{ post.content }}
          </n-ellipsis>
        </div>

        <template #footer>
          <span class="text-12px font-thin">
            {{ post.ctime.format('YYYY-MM-DD HH:mm:ss') }}
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
