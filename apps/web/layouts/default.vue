<script setup lang="ts">
import type {
  ConfigProviderProps,
  DialogOptions,
  NotificationOptions,
} from 'naive-ui'

import { useNavigatorLanguage } from '@vueuse/core'
import {
  createDiscreteApi,
  darkTheme,
  dateEnUS,
  dateZhCN,
  enUS,
  lightTheme,
  useOsTheme,
  zhCN,
} from 'naive-ui'
import PubSub from 'pubsub-js'

const ZhLanguagePack = {
  locale: zhCN,
  date: dateZhCN,
}

const EnLanguagePack = {
  locale: enUS,
  date: dateEnUS,
}

const { language } = useNavigatorLanguage()
const SysLanguagePack = computed(() => {
  switch (language.value) {
    case 'zh':
      return ZhLanguagePack
    case 'en':
      return EnLanguagePack
  }
})

const preferences = useGuiPreferencesStore()
const { $i18n } = useNuxtApp()

const osThemeRef = useOsTheme()
const theme = computed(() => {
  switch (preferences.value.theme) {
    case ThemeKind.Dark:
      return darkTheme
    case ThemeKind.Light:
      return lightTheme
    case ThemeKind.OS:
    default:
      return osThemeRef.value === ThemeKind.Dark ? darkTheme : lightTheme
  }
})

const lang = computed<UserLanguage | undefined>(() => {
  switch (preferences.value.language) {
    case LanguageKind.Zh:
      return ZhLanguagePack
    case LanguageKind.En:
      return EnLanguagePack
    case LanguageKind.OS:
    default:
      return SysLanguagePack.value
  }
})

watch(
  lang,
  (value) => {
    const locale = value?.locale.name.substring(0, 2)
    if (locale)
      $i18n.setLocale(locale)
  },
  {
    immediate: true,
  },
)

const configProviderPropsRef = computed<ConfigProviderProps>(() => {
  return {
    theme: theme.value,
  }
})

const { message, notification, dialog, loadingBar } = createDiscreteApi(
  [ 'message', 'dialog', 'notification', 'loadingBar' ],
  {
    configProviderProps: configProviderPropsRef,
  },
)

PubSub.subscribe(PubSubEvents.Dialog, (_: string, opts: DialogOptions) => {
  dialog.create(opts)
})
PubSub.subscribe(
  PubSubEvents.Notification,
  (_: string, opts: NotificationOptions) => notification.create(opts),
)
PubSub.subscribe(PubSubEvents.Message, (_: string, opts: MsgOptions) =>
  message.create(opts.content, opts))
PubSub.subscribe(PubSubEvents.Loading, (_: string, status: boolean) =>
  status ? loadingBar.start() : loadingBar.finish())

onMounted(() => {
  preferences.load()
})
</script>

<template>
  <n-config-provider
    :theme="theme"
    :locale="lang?.locale"
    :date-locale="lang?.date"
  >
    <n-layout position="absolute">
      <slot />
    </n-layout>
  </n-config-provider>
</template>
