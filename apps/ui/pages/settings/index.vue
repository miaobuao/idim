<script setup lang="ts">
import { last } from 'lodash-es';

import { type ThemeKind as ThemeKindType } from '#imports';
const { $text } = useNuxtApp();
import {
  type SettingsPageProps,
  OptionType,
} from '../../components/settings/types';

const user = useUserStore();
const preferences = useGuiPreferencesStore();

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
      hidden: () => !user.self.id,
      children: [
        {
          type: OptionType.Label,
          // hidden: () => user.activated,
          title: $text.verify_mail(),
          caption: $text.verify_mail_caption(),
        },
        {
          type: OptionType.Label,
          title: $text.change_psw(),
          caption: $text.change_psw_caption(),
        },
        {
          type: OptionType.Btn,
          text: $text.logout(),
          btnType: 'error',
          click: logout,
        },
      ],
    },
  ],
};

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
          value: () => preferences.value.theme,
          select(v: ThemeKindType) {
            preferences.update({
              theme: v,
            });
          },
        },
      ],
    },
  ],
};

const token = useTokenStore();
const pagesMap = new Map([MainPage, SwicthThemePage].map((d) => [d.id, d]));
const settingsRouter = reactive<string[]>([]);
const currentPage = computed(
  () => pagesMap.get(last(settingsRouter) ?? 'main') ?? MainPage
);
const route = useRoute();
const router = useRouter();

function logout() {
  dialog({
    type: 'warning',
    title: $text.logout(),
    content: $text.logout_confirm(),
    positiveText: $text.logout(),
    onPositiveClick() {
      token.clearJwtToken();
      user.clear();
    },
  });
}
function popRouter() {
  settingsRouter.pop();
}
function pushRouter(v: string) {
  settingsRouter.push(v);
}
</script>

<template>
  <div class="flex flex-col gap-y-1 m-1">
    <settings-view
      :pop="settingsRouter.length > 0 ? popRouter : undefined"
      :page="currentPage"
      @push="pushRouter"
    />
  </div>
</template>
