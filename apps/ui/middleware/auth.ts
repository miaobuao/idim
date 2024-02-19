const { $pinia } = useNuxtApp();

export default defineNuxtRouteMiddleware(async () => {
  const session = useSessionStore($pinia);
  if (session.payload === undefined) {
    return navigateTo({ name: 'user-login' });
  }
  return true;
});
