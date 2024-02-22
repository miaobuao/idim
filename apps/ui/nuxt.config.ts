import ReactivityTransform from '@vue-macros/reactivity-transform/vite';
import { defineNuxtConfig, type NuxtConfig } from 'nuxt/config';
import AutoImport from 'unplugin-auto-import/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
const vite: NuxtConfig['vite'] = {
  optimizeDeps: {
    include:
      process.env.NODE_ENV === 'development'
        ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
        : [],
  },
};

const modules: NuxtConfig['modules'] = [
  '@nuxtjs/eslint-module',
  '@unocss/nuxt',
  [
    '@nuxtjs/i18n',
    {
      i18n: {
        vueI18n: './i18n.config.ts',
      },
    },
  ],
  '@vue-macros/nuxt',
  (_options, nuxt) => {
    nuxt.hooks.hook('vite:extendConfig', (config) => {
      config.plugins.push(
        AutoImport({
          imports: ['vue', 'vue-router', '@vueuse/core'],
        }),
        Components({
          resolvers: [NaiveUiResolver()],
        }),
        ReactivityTransform()
      );
    });
  },
  [
    '@pinia/nuxt',
    {
      autoImports: ['defineStore', ['defineStore', 'definePiniaStore']],
    },
  ],
];

export default defineNuxtConfig({
  devtools: { enabled: true },
  vite,
  modules,
  ssr: true,
  components: [
    {
      path: '~/components',
      extensions: ['.vue'],
    },
  ],
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
            'naive-ui',
            'vueuc',
            '@css-render/vue3-ssr',
            '@juggle/resize-observer',
          ]
        : ['@juggle/resize-observer'],
  },
  runtimeConfig: {
    public: {
      API_PORT: process.env.API_PORT,
      API_HOST: process.env.API_HOST,
    },
  },
});
