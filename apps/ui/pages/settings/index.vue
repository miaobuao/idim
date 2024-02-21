<script setup lang="ts">
import { last } from 'lodash-es';

import { type ThemeKind as ThemeKindType } from '#imports';
const { $text } = useNuxtApp();
// import {/
import {
  type SettingsPageProps,
  OptionType,
} from '../../components/settings/types';

const MainPage: SettingsPageProps = {
  id: 'main',
  label: $text.settings(),
  children: [
    {
      label: $text.header.general(),
      children: [
        {
          type: OptionType.Label,
          title: $text.switch_theme(),
          caption: $text.switch_theme_caption(),
          to: 'switch theme',
        },
      ],
    },
    {
      label: $text.header.user(),
      // hidden: () => !user.id,
      children: [
        {
          type: OptionType.Label,
          // hidden: () => user.activated,
          title: $text.verify_mail(),
          caption: $text.verify_mail_caption(),
          to: { name: 'me' },
        },
        {
          type: OptionType.Label,
          title: $text.change_psw(),
          caption: $text.change_psw_caption(),
          to: { name: 'me' },
        },
        {
          type: OptionType.Btn,
          text: $text.logout(),
          color: 'negative',
          class: 'full-width',
          click: logout,
        },
      ],
    },
  ],
};

const preferences = useGuiPreferencesStore();

const SwicthThemePage: SettingsPageProps = {
  id: 'switch theme',
  label: $text.switch_theme(),
  children: [
    {
      label: $text.switch_theme(),
      children: [
        {
          type: OptionType.Radio,
          options: [
            {
              label: $text.theme.light(),
              value: ThemeKind.Light,
            },
            {
              label: $text.theme.dark(),
              value: ThemeKind.Dark,
            },
            {
              label: $text.theme.auto(),
              value: ThemeKind.OS,
            },
          ],
          value: preferences.value.theme,
          select(v: ThemeKindType) {
            this.value = v;
            preferences.update({
              theme: v,
            });
          },
        },
      ],
    },
  ],
};

function logout() {}
const pagesMap = new Map([MainPage, SwicthThemePage].map((d) => [d.id, d]));
const settingsRouter = reactive<string[]>([]);
const currentPage = computed(
  () => pagesMap.get(last(settingsRouter) ?? 'main') ?? MainPage
);
</script>

<template>
  <div class="flex flex-col gap-y-1 m-1">
    <settings-view :page="currentPage" />
  </div>
</template>
