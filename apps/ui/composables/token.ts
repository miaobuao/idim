import type { JwtPayload } from '@idim/api';

import { isClient } from '@vueuse/core';
import { jwtDecode } from 'jwt-decode';
const JWT_TOKEN_KEY = 'user-token';

export const useTokenStore = defineStore('token', () => {
  const token = ref<string>();
  const payload = computed<JwtPayload | undefined>(
    () => (token.value && jwtDecode(token.value)) || undefined
  );

  if (isClient) {
    load();
    if (token.value) {
      const { $trpc } = useNuxtApp();
      const user = useUserStore();
      $trpc.session.getUserInfo
        .query()
        .then((data) => {
          user.self.id = data.id;
          user.self.name = data.name;
        })
        .catch(clearJwtToken);
    }
  }

  function clearJwtToken() {
    localStorage.removeItem(JWT_TOKEN_KEY);
    sessionStorage.removeItem(JWT_TOKEN_KEY);
    token.value = undefined;
  }

  function updateJwtToken(jwt: string) {
    token.value = jwt;
  }

  function saveInLocalStorage() {
    if (token.value) {
      localStorage.setItem(JWT_TOKEN_KEY, token.value);
    }
  }
  function saveInSessionStorage() {
    if (token.value) {
      sessionStorage.setItem(JWT_TOKEN_KEY, token.value);
    }
  }
  function load() {
    const value =
      localStorage.getItem(JWT_TOKEN_KEY) ||
      sessionStorage.getItem(JWT_TOKEN_KEY);
    if (value) {
      token.value = value;
    }
  }

  return {
    payload,
    updateJwtToken,
    saveInLocalStorage,
    saveInSessionStorage,
    load,
    clearJwtToken,
    value: computed(() => token.value),
  };
});
