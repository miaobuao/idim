<template>
  <n-space class="m-1%" vertical>
    <n-card :title="$text.settings()" size="small"></n-card>
    <!-- <n-card :title="$text.header.general()" size="small">
      <n-list hoverable clickable>
        <n-list-item>
          <n-thing :title="$text.switch_theme()">
            {{ $text.switch_theme_caption() }}
          </n-thing>
        </n-list-item>
      </n-list>
    </n-card>
    <n-card :title="$text.header.user()" size="small">
      <n-list hoverable clickable>
        <n-list-item>
          <n-thing :title="$text.verify_mail()">
            {{ $text.verify_mail_caption() }}
          </n-thing>
        </n-list-item>
        <n-list-item>
          <n-thing :title="$text.change_psw()">
            {{ $text.change_psw_caption() }}
          </n-thing>
        </n-list-item>
      </n-list>
    </n-card> -->
    <n-card
      v-for="items in settings"
      :key="items.case"
      :title="items.label"
      size="small"
    >
      <n-list hoverable clickable>
        <n-list-item v-for="item in items.children" :key="item.label">
          <n-thing :title="item.label">
            {{ item.info }}
          </n-thing>
        </n-list-item>
      </n-list>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
const { $text } = useNuxtApp();
import { settings } from '@/pages/settings/settings.vue';
</script>
