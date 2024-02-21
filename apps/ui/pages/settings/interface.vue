<template>interface</template>
<script lang="ts">
import type { RouteLocationPathRaw } from 'vue-router';
interface Item {
  label: string;
  info: string;
  path?: string | RouteLocationPathRaw;
}
interface Items extends Array<Item> {}
interface SettingsPageTypeItem {
  case: string;
  label: string;
  children: Items;
}
export interface SettingsPageType extends Array<SettingsPageTypeItem> {}
</script>
