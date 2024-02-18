import en from '../locales/en';
import zh from '../locales/zh';

export default defineNuxtPlugin(() => {
  const text = buildLanguagePack();
  return {
    provide: {
      text,
    },
  };
});

function buildLanguagePack() {
  const { $i18n } = useNuxtApp();
  const merged = Object.assign({}, clone(en), clone(zh));

  function dfs(obj: any, prefix: string[]) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        obj[key] = (args?: Record<string, string | number>) =>
          $i18n.t([...prefix, key].join('.'), args ?? {});
      } else if (typeof value !== 'function') {
        dfs(value, [...prefix, key]);
      }
    }
  }
  dfs(merged, []);
  return merged as unknown as StringToI18nText<typeof merged>;
}

type StringToI18nText<T> = {
  [K in keyof T]: T[K] extends string
    ? (args?: Record<string, string | number>) => string
    : StringToI18nText<T[K]>;
};

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
