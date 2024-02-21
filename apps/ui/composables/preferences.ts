import { isClient, useNavigatorLanguage } from '@vueuse/core';
import {
  type NLocale,
  type NDateLocale,
  useOsTheme,
  darkTheme,
  lightTheme,
  enUS,
  dateEnUS,
  zhCN,
  dateZhCN,
} from 'naive-ui';

const ZhLanguagePack = {
  locale: zhCN,
  date: dateZhCN,
};

const EnLanguagePack = {
  locale: enUS,
  date: dateEnUS,
};

const { language } = useNavigatorLanguage();
const SysLanguagePack = computed(() => {
  switch (language.value) {
    case 'zh':
      return ZhLanguagePack;
    case 'en':
      return EnLanguagePack;
  }
});

const osThemeRef = useOsTheme();

export const useGuiPreferencesStore = defineStore('gui-preferences', () => {
  const preferences = ref<GuiPreferences>({
    theme: ThemeKind.OS,
    language: LanguageKind.OS,
  });

  function load() {
    const value = localStorage.getItem('gui-preferences');
    if (value) {
      update(JSON.parse(value));
    }
  }

  function update(newPreferences: Partial<GuiPreferences>) {
    preferences.value = { ...preferences.value, ...newPreferences };
    save();
  }

  function save() {
    if (isClient)
      localStorage.setItem(
        'gui-preferences',
        JSON.stringify(preferences.value)
      );
  }

  const theme = computed(() => {
    switch (preferences.value.theme) {
      case ThemeKind.Dark:
        return darkTheme;
      case ThemeKind.Light:
        return lightTheme;
      case ThemeKind.OS:
      default:
        return osThemeRef.value === ThemeKind.Dark ? darkTheme : lightTheme;
    }
  });

  const lang = computed<UserLanguage | undefined>(() => {
    switch (preferences.value.language) {
      case LanguageKind.Zh:
        return ZhLanguagePack;
      case LanguageKind.En:
        return EnLanguagePack;
      case LanguageKind.OS:
      default:
        return SysLanguagePack.value;
    }
  });
  return {
    theme,
    lang,
    update,
    save,
    load,
    value: computed(() => preferences.value),
  };
});

export interface GuiPreferences {
  theme: ThemeKind;
  language: LanguageKind;
}

export interface UserLanguage {
  locale: NLocale;
  date: NDateLocale;
}

export enum ThemeKind {
  Light = 'light',
  Dark = 'dark',
  OS = 'os',
}

export enum LanguageKind {
  Zh = 'zh',
  En = 'en',
  OS = 'os',
}
