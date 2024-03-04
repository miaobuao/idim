<script setup lang="ts">
import type { ThemeKind as ThemeKindType } from '#imports'

import { last } from 'lodash-es'

import {
  CardBuilder,
  PageBuilder,
  createPages,
} from '~/components/settings/utils'

const { $text } = useNuxtApp()

const user = useUserStore()
const preferences = useGuiPreferencesStore()
const [_, pagesMap] = createPages(
  new PageBuilder('main', $text.settings())
    .addCard(
      new CardBuilder($text.header.general()).addLabel({
        title: $text.switch_theme(),
        caption: $text.switch_theme_caption(),
        to: 'switch theme',
      }),
    )
    .addCard(
      new CardBuilder($text.header.user())
        .hidden(() => !user.self.id)
        .addLabel({
          title: $text.verify_mail(),
          caption: $text.verify_mail_caption(),
        })
        .addLabel({
          title: $text.change_psw(),
          caption: $text.change_psw_caption(),
        })
        .addBtn({
          text: $text.logout(),
          btnType: 'error',
          click: logout,
        }),
    ),
  new PageBuilder('switch theme', $text.switch_theme()).addCard(
    new CardBuilder($text.switch_theme()).addRadio({
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
        })
      },
    }),
  ),
)

const route = useRoute()
const router = useRouter()
const token = useTokenStore()
const settingsRouter = reactive(
  (function () {
    const path = route.query?.path
    if (path) {
      if (typeof path === 'string')
        return [path]
    }
    return []
  })(),
)
const currentPage = computed(
  () => pagesMap.get(last(settingsRouter) ?? 'main')!,
)

function logout() {
  dialog({
    type: 'warning',
    title: $text.logout(),
    content: $text.logout_confirm(),
    positiveText: $text.logout(),
    onPositiveClick() {
      token.clearJwtToken()
      user.clear()
    },
  })
}

function popRouter() {
  settingsRouter.pop()
  router.replace({
    name: route.name!,
    query: { path: settingsRouter },
  })
}
function pushRouter(v: string) {
  settingsRouter.push(v)
  router.replace({
    name: route.name!,
    query: { path: settingsRouter },
  })
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
