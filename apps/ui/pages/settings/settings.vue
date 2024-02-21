<template>settings</template>
<script lang="ts">
import type { SettingsPageType } from '@/pages/settings/interface.vue';
const { $text } = useNuxtApp();
// const main_page: SettingsPageType = {
//   name: 'main',
//   label: $text.settings(),
//   children: [
//     {
//       label: $text.header.general(),
//       children: [
//         {
//           type: 'label',
//           title: $text.switch_theme(),
//           caption: $text.switch_theme_caption(),
//           to: 'switch theme',
//         },
//       ],
//     },
//     {
//       label: $text.header.user(),
//       // hidden: () => !user.id,
//       children: [
//         {
//           type: 'label',
//           // hidden: () => user.activated,
//           title: $text.verify_mail(),
//           caption: $text.verify_mail_caption(),
//           to: { path: '/account/verify_mail' },
//         },
//         {
//           type: 'label',
//           title: $text.change_psw(),
//           caption: $text.change_psw_caption(),
//           to: { path: '/change_psw' },
//         },
//         // {
//         //   type: 'btn',
//         //   text: $text.logout(),
//         //   color: 'negative',
//         //   class: 'full-width',
//         //   click: logout,
//         // },
//       ],
//     },
//   ],
// };

const settings: SettingsPageType = [
  {
    case: 'general',
    label: $text.header.general(),
    children: [
      {
        //switch_theme
        label: $text.switch_theme(),
        info: $text.switch_theme_caption(),
      },
    ],
  },
  {
    case: 'user',
    label: $text.header.user(),
    children: [
      {
        //verify_mail
        label: $text.verify_mail(),
        info: $text.verify_mail_caption(),
      },
      {
        //change_psw
        label: $text.change_psw(),
        info: $text.change_psw_caption(),
      },
    ],
  },
];
export { settings };
</script>
