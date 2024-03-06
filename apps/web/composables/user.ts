export const useUserStore = defineStore('user', () => {
  const self = reactive({
    id: 0,
    username: '',
  })
  function clear() {
    self.id = 0
    self.username = ''
  }
  return {
    self,
    clear,
  }
})
