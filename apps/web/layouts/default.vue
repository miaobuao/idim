<script setup lang="ts">
import type { ConfigProviderProps } from 'naive-ui'

import { dayjs } from '@repo/common'
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
import { Subject } from 'rxjs'

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
    default:
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
    if (locale) {
      $i18n.setLocale(locale)
      dayjs.locale(locale)
    }
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

const {
  message: msger,
  notification: notifier,
  dialog: dialoger,
  loadingBar: loadingBarer,
} = createDiscreteApi([ 'message', 'dialog', 'notification', 'loadingBar' ], {
  configProviderProps: configProviderPropsRef,
})

const unmounted = new Subject<void>()
onBeforeMount(() => {
  preferences.load()

  const subscribers = [
    notify.subscribe((opt) => {
      notifier.create(opt)
    }),
    message.subscribe((opt) => {
      msger.create(opt.content, opt)
    }),
    dialog.subscribe((opt) => {
      dialoger.create(opt)
    }),
    startLoading.subscribe(() => {
      loadingBarer.start()
    }),
    stopLoading.subscribe(() => {
      loadingBarer.finish()
    }),
  ]

  unmounted.subscribe(() => {
    subscribers.forEach(s => s.unsubscribe())
  })
})

onBeforeUnmount(() => {
  unmounted.next()
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
