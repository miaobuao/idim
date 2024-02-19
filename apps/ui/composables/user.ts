export const useUserStore = defineStore('user', () => {
  const self = reactive({
    id: 0,
    name: '',
  });
  return {
    self,
  };
});
