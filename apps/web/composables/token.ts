import type { JwtPayload } from '~/server/trpc/utils/jwt'

import { isClient } from '@vueuse/core'
import { decodeJwt } from 'jose'

import { useTrpc } from '~/utils/uses'

const JWT_TOKEN_KEY = 'user-token'

export const useTokenStore = defineStore('token', () => {
  const token = ref<string>()
  const payload = computed(
    () => (token.value && decodeJwt<JwtPayload>(token.value)) || undefined,
  )

  if (isClient) {
    load()
    if (token.value) {
      const $trpc = useTrpc()
      const user = useUserStore()
      $trpc.session.auth
        .query()
        .then((data) => {
          // @ts-expect-error
          user.updateSelf(data)
        })
        .catch(clearJwtToken)
    }
  }

  function clearJwtToken() {
    localStorage.removeItem(JWT_TOKEN_KEY)
    sessionStorage.removeItem(JWT_TOKEN_KEY)
    token.value = undefined
  }

  function updateJwtToken(jwt: string) {
    token.value = jwt
  }

  function saveInLocalStorage() {
    if (token.value)
      localStorage.setItem(JWT_TOKEN_KEY, token.value)
  }
  function saveInSessionStorage() {
    if (token.value)
      sessionStorage.setItem(JWT_TOKEN_KEY, token.value)
  }
  function load() {
    const value
      = localStorage.getItem(JWT_TOKEN_KEY)
      || sessionStorage.getItem(JWT_TOKEN_KEY)
    if (value)
      token.value = value
  }

  return {
    payload,
    updateJwtToken,
    saveInLocalStorage,
    saveInSessionStorage,
    load,
    clearJwtToken,
    value: computed(() => token.value),
  }
})
