<script setup lang="tsx">
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
import { NEllipsis, NIcon, NSpin, useThemeVars } from 'naive-ui'

import Avatar from '~/components/avatar.vue'
import { screen } from '~/utils/screen'

const router = useRouter()
const route = useRoute()
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
const selectedKey = ref('')

function renderComputedMenuOption(label: string, key: string, icon: Component) {
  return computed(() =>
    !route.name?.toString().startsWith(key) && selectedKey.value === key
      ? renderMenuOption(label, key, icon, true)
      : renderMenuOption(label, key, icon, false),
  )
}

const IndividualOption = computed(() => ({
  label: () => renderLabel(user.self.username, 'me'),
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
}))
const UserLoginOption = renderComputedMenuOption(
  $text.login_or_register(),
  'user-login',
  UserIcon,
)
const BookOption = renderComputedMenuOption(
  $text.bookmark(),
  'index',
  BookmarkIcon,
)
const BBSOption = renderComputedMenuOption($text.bbs(), 'bbs', BBSIcon)
const McOption = renderComputedMenuOption($text.minecraft(), 'mc', XboxIcon)
const VideoPlayerOption = renderComputedMenuOption(
  $text.video.player.title(),
  'video-player',
  PlayerIcon,
)
const SettingsOption = renderComputedMenuOption(
  $text.settings(),
  'settings',
  SettingsIcon,
)

const menuOptions = computed(() => [
  token.payload === undefined ? UserLoginOption.value : IndividualOption.value,
  BookOption.value,
  BBSOption.value,
  McOption.value,
  VideoPlayerOption.value,
  SettingsOption.value,
])

function renderMenuOption(
  label: string,
  key: string,
  icon: Component,
  loading: boolean,
): MenuOption {
  return {
    label: () => renderLabel(label, key),
    icon: () => (
      <NIcon>
        <NSpin show={loading} size="small">
          {() => h(icon)}
        </NSpin>
      </NIcon>
    ),
    key,
  }
}

function renderLabel(text: string, to: string) {
  return (
    <div onClick={() => (selectedKey.value = to)}>
      <NEllipsis>{text}</NEllipsis>
    </div>
  )
}

function onSelectKey(key: string) {
  selectedKey.value = key
  router.push({ name: key })
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
          @update:value="onSelectKey"
        />
      </n-layout-sider>
      <n-layout-content>
        <slot />
      </n-layout-content>
    </n-layout>
  </NuxtLayout>
</template>
