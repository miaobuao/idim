import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
import process from 'node:process'
import { type NuxtConfig, defineNuxtConfig } from 'nuxt/config'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

const vite: NuxtConfig['vite'] = {
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    include:
      process.env.NODE_ENV === 'development'
        ? [ 'naive-ui', 'vueuc', 'date-fns-tz' ]
        : [],
  },
}

export default defineNuxtConfig({
  nitro: {
    cloudflareDev: {
      persistDir: '../../.wrangler/state/v3',
    },
  },
  devtools: { enabled: true },
  vite,
  modules: [
    '@unocss/nuxt',
    '@formkit/auto-animate/nuxt',
    'nitro-cloudflare-dev',
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
        config.plugins?.push(
          AutoImport({
            imports: [ 'vue', 'vue-router', '@vueuse/core' ],
          }),
          Components({
            resolvers: [ NaiveUiResolver() ],
          }),
          ReactivityTransform(),
        )
      })
    },
    [
      '@pinia/nuxt',
      {
        autoImports: [ 'defineStore', [ 'defineStore', 'definePiniaStore' ] ],
      },
    ],
  ],
  ssr: false,
  components: [
    {
      path: '~/components',
      extensions: [ '.vue' ],
    },
  ],
  build: {
    transpile: [
      'trpc-nuxt',
      ...process.env.NODE_ENV === 'production'
        ? [
            'naive-ui',
            'vueuc',
            '@css-render/vue3-ssr',
            '@juggle/resize-observer',
          ]
        : [ '@juggle/resize-observer' ],
    ],
  },
  runtimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    OAUTH_JWT_EXPIRES_IN: process.env.OAUTH_JWT_EXPIRES_IN,
    SMTP_JWT_EXPIRES_IN: process.env.SMTP_JWT_EXPIRES_IN,
    JWT_ISSUER: process.env.JWT_ISSUER,
    SMTP_API_URL: process.env.SMTP_API_URL,
    SMTP_API_AES_KEY: process.env.SMTP_API_AES_KEY,
    SMTP_API_AES_IV: process.env.SMTP_API_AES_IV,
    public: {
      BBS: {
        TITLE_MAX_LENGTH: 100,
        TITLE_MIN_LENGTH: 2,
        CONTENT_MAX_LENGTH: 10000,
        CONTENT_MIN_LENGTH: 5,
      },
    },
  },
})
