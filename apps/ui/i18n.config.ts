import { zh, en } from '@repo/locales';

export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'zh',
  messages: {
    en,
    zh,
  },
}));
