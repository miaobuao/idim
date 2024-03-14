export const useUserStore = defineStore('user', () => {
  const self = reactive({
    id: 0,
    username: '',
    email: '',
  })
  function clear() {
    self.id = 0
    self.username = ''
    self.email = ''
  }
  return {
    self,
    clear,
  }
})
