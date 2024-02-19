import { buildLanguagePack } from '@repo/locales';

export default defineNuxtPlugin(() => {
  const { $i18n } = useNuxtApp();
  const text = buildLanguagePack($i18n.t);
  return {
    provide: {
      text,
    },
  };
});
