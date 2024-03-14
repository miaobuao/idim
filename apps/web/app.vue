<script setup lang="ts">
import type { MenuOption } from 'naive-ui'

import {
  ChatboxOutline as BBSIcon,
  BookmarkOutline as BookmarkIcon,
  PlayForwardOutline as PlayerIcon,
  SettingsOutline as SettingsIcon,
  PersonOutline as UserIcon,
  LogoXbox as XboxIcon,
} from '@vicons/ionicons5'
import { vElementHover } from '@vueuse/components'
import { NEllipsis, NIcon, useThemeVars } from 'naive-ui'
import { RouterLink } from 'vue-router'

import Avatar from './components/avatar.vue'
import { screen } from './utils/screen'

const themeVars = useThemeVars()
const user = useUserStore()
const token = useTokenStore()
const editingCollapsed = ref(true)
const collapsed = computed({
  get() {
    return editingCollapsed.value
  },
  set(value) {
    if (screen.lt.md.value)
      editingCollapsed.value = true
    else editingCollapsed.value = value
  },
})
const { $text } = useNuxtApp()
const menuOptions = computed(() => [
  token.payload === undefined
    ? renderMenuOption($text.login_or_register(), 'user-login', UserIcon)
    : {
        label: user.self.username,
        key: 'me',
        icon: () =>
          h(
            Avatar,
            {
              size: 25,
              color: themeVars.value.primaryColor,
            },
            {
              default: () => user.self.username.charAt(0).toUpperCase(),
            },
          ),
      },
  renderMenuOption($text.bookmark(), 'index', BookmarkIcon),
  renderMenuOption($text.bbs(), 'bbs', BBSIcon),
  renderMenuOption($text.minecraft(), 'mc', XboxIcon),
  renderMenuOption($text.video.player.title(), 'video-player', PlayerIcon),
  renderMenuOption($text.settings(), 'settings', SettingsIcon),
])

function renderMenuOption(
  label: string,
  key: string,
  icon: Component,
): MenuOption {
  return {
    label: renderLabel(label, key),
    icon: renderIcon(icon),
    key,
  }
}
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
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
      },
    )
}
</script>

<template>
  <NuxtLayout>
    <n-layout has-sider position="absolute">
      <n-layout-sider
        v-model:collapsed="collapsed"
        v-element-hover="(status) => (collapsed = !status)"
        collapse-mode="width"
        :collapsed-width="54"
        :width="220"
        bordered
      >
        <n-menu
          :value="$route.name?.toString()"
          :collapsed-width="54"
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
