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

<script setup lang="ts">
import type { DialogOptions, MenuOption, NotificationOptions } from 'naive-ui';

import {
  BookmarkOutline as BookmarkIcon,
  PlayForwardOutline as PlayerIcon,
  SettingsOutline as SettingsIcon,
  ChatboxOutline as BBSIcon,
  LogoXbox as XboxIcon,
  PersonOutline as UserIcon,
} from '@vicons/ionicons5';
import { vElementHover } from '@vueuse/components';
import { NIcon, NEllipsis, NAvatar } from 'naive-ui';
import { type ConfigProviderProps, createDiscreteApi } from 'naive-ui';
import PubSub from 'pubsub-js';
import { RouterLink } from 'vue-router';

import { screen } from './utils/screen';

const configProviderPropsRef = computed<ConfigProviderProps>(() => {
  const preferences = useGuiPreferencesStore();
  return {
    theme: preferences.theme,
  };
});

const { message, notification, dialog, loadingBar } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar'],
  {
    configProviderProps: configProviderPropsRef,
  }
);

PubSub.subscribe(PubSubEvents.Dialog, (_: string, opts: DialogOptions) => {
  dialog.create(opts);
});
PubSub.subscribe(
  PubSubEvents.Notification,
  (_: string, opts: NotificationOptions) => notification.create(opts)
);
PubSub.subscribe(PubSubEvents.Message, (_: string, opts: MsgOptions) =>
  message.create(opts.content, opts)
);
PubSub.subscribe(PubSubEvents.Loading, (_: string, status: boolean) =>
  status ? loadingBar.start() : loadingBar.finish()
);

const user = useUserStore();
const token = useTokenStore();
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
  token.payload === undefined
    ? renderMenuOption($text.login_or_register(), 'user-login', UserIcon)
    : {
        label: user.self.name,
        key: 'me',
        icon: () =>
          h(
            NAvatar,
            {
              size: 25,
              color: '#18a058',
            },
            {
              default: () => user.self.name.charAt(0).toUpperCase(),
            }
          ),
      },
  renderMenuOption($text.bookmark(), 'index', BookmarkIcon),
  renderMenuOption($text.bbs(), 'bbs', BBSIcon),
  renderMenuOption($text.minecraft(), 'mc', XboxIcon),
  renderMenuOption($text.video.player.title(), 'video-player', PlayerIcon),
  renderMenuOption($text.settings(), 'settings', SettingsIcon),
]);

function renderMenuOption(
  label: string,
  key: string,
  icon: Component
): MenuOption {
  return {
    label: renderLabel(label, key),
    icon: renderIcon(icon),
    key,
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
