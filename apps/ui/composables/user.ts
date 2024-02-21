export const useUserStore = defineStore('user', () => {
  const self = reactive({
    id: 0,
    name: '',
  });
  function clear() {
    self.id = 0;
    self.name = '';
  }
  return {
    self,
    clear,
  };
});
