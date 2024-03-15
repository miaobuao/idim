<script setup lang="ts">
defineProps<{
  id: number
  author: { username: string, id: number }
  content: string
  mtime: Date | string
}>()
</script>

<template>
  <n-card v-bind="$attrs" content-class="pb-0!">
    <n-thing content-class="m-0!">
      <template #avatar>
        <avatar color="#ee7623" size="small">
          {{ author.username.slice(0, 1) }}
        </avatar>
      </template>
      <template #header>
        <n-ellipsis :line-clamp="1" :tooltip="false">
          {{ author.username }}
        </n-ellipsis>
      </template>

      <n-ellipsis :line-clamp="3" :tooltip="false" expand-trigger="click">
        <div v-html="md.render(content)" />
      </n-ellipsis>
    </n-thing>
  </n-card>
</template>
