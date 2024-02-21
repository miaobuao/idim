<template>
  <n-card :title="page.label" size="small"></n-card>
  <setting-isolated-card
    v-for="(card, i) in page.children"
    :key="i"
    v-bind="card"
  />
</template>

<script setup lang="ts">
import type { SettingsPageProps } from './types.ts';

import SettingIsolatedCard from './card.tsx';

defineProps<{
  page: SettingsPageProps;
}>();
</script>
