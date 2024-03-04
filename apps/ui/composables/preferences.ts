import type { NDateLocale, NLocale } from 'naive-ui'

import { isClient } from '@vueuse/core'

export const useGuiPreferencesStore = defineStore('gui-preferences', () => {
  const preferences = ref<GuiPreferences>({
    theme: ThemeKind.OS,
    language: LanguageKind.OS,
  })

  function load() {
    const value = localStorage.getItem('gui-preferences')
    if (value)
      update(JSON.parse(value))
  }

  function update(newPreferences: Partial<GuiPreferences>) {
    preferences.value = {
      ...preferences.value,
      ...newPreferences,
    }
    save()
  }

  function save() {
    if (isClient) {
      localStorage.setItem(
        'gui-preferences',
        JSON.stringify(preferences.value),
      )
    }
  }

  return {
    update,
    save,
    load,
    value: computed(() => preferences.value),
  }
})

export interface GuiPreferences {
  theme: ThemeKind
  language: LanguageKind
}

export interface UserLanguage {
  locale: NLocale
  date: NDateLocale
}

export enum ThemeKind {
  Light = 'light',
  Dark = 'dark',
  OS = 'system',
}

export enum LanguageKind {
  Zh = 'zh',
  En = 'en',
  OS = 'system',
}

export function strToThemeKind(value: string): ThemeKind {
  switch (value) {
    case 'light':
      return ThemeKind.Light
    case 'dark':
      return ThemeKind.Dark
    case 'system':
    default:
      return ThemeKind.OS
  }
}
