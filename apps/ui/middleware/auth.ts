const { $pinia } = useNuxtApp();

export default defineNuxtRouteMiddleware(async () => {
  const token = useTokenStore($pinia);
  if (!token.payload) {
    return navigateTo({ name: 'user-login' });
  }
  return true;
});
