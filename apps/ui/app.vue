<template>
  <NuxtLayout>
    <n-layout has-sider position="absolute">
      <n-layout-sider
        v-model:collapsed="collapsed"
        v-element-hover="(status) => (collapsed = !status)"
        collapse-mode="width"
        :collapsed-width="56"
        :width="220"
        bordered
      >
        <n-menu
          :value="$route.name?.toString()"
          :collapsed-width="56"
          :collapsed-icon-size="24"
          :options="menuOptions"
        />
      </n-layout-sider>
      <n-layout-content>
        <NuxtPage />
      </n-layout-content>
    </n-layout>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { MenuOption } from 'naive-ui';

import {
  BookmarkOutline as BookmarkIcon,
  PlayForwardOutline as PlayerIcon,
  SettingsOutline as SettingsIcon,
  ChatboxOutline as BBSIcon,
  LogoXbox as XboxIcon,
  PersonOutline as UserIcon,
} from '@vicons/ionicons5';
import { vElementHover } from '@vueuse/components';
import { NIcon, NEllipsis } from 'naive-ui';
import { RouterLink } from 'vue-router';

import { screen } from './utils/screen';

const editingCollapsed = ref(true);
const collapsed = computed({
  get() {
    return editingCollapsed.value;
  },
  set(value) {
    if (screen.lt.md.value) {
      editingCollapsed.value = true;
    } else {
      editingCollapsed.value = value;
    }
  },
});
const { $text } = useNuxtApp();
const menuOptions = computed(() => [
  renderMenuOption('me', 'me', UserIcon),
  renderMenuOption($text.bookmark.title(), 'index', BookmarkIcon),
  renderMenuOption($text.bbs.title(), 'bbs', BBSIcon),
  renderMenuOption($text.minecraft.title(), 'mc', XboxIcon),
  renderMenuOption($text.video.player.title(), 'video-player', PlayerIcon),
  renderMenuOption($text.settings.title(), 'settings', SettingsIcon),
]);

function renderMenuOption(
  label: string,
  key: string,
  icon: Component
): MenuOption {
  return {
    label: renderLabel(label, key),
    key,
    icon: renderIcon(icon),
  };
}
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
function renderLabel(text: string, to: string) {
  return () =>
    h(
      RouterLink,
      {
        to: {
          name: to,
        },
      },
      {
        default: () => h(NEllipsis, null, { default: () => text }),
      }
    );
}
</script>
