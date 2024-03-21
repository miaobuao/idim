interface BasicUserInfo {
  id: number
  username: string
}

const batcher = new Batcher(1000)
export const useUserStore = defineStore('user', () => {
  const self = reactive({
    id: -1,
    username: '',
    email: '',
  })
  const userCache = reactive < Map<number, BasicUserInfo>>(new Map())
  const pendingMap = new Map<number, boolean>()
  function clear() {
    if (self.id < 0)
      return
    userCache.delete(self.id)
    self.id = -1
    self.username = ''
    self.email = ''
  }

  function getInfo(id: number) {
    batcher.start()
    const abort = batcher.push(async () => {
      if (userCache.has(id) || pendingMap.has(id))
        return
      pendingMap.set(id, true)
      const $trpc = useTrpc()
      await $trpc.user.getInfo.query({
        userId: id,
      }).then((d) => {
        userCache.set(id, d)
      }).catch(errorHandler)
      pendingMap.delete(id)
    })
    if (self.id === id)
      abort()
    const data = computed(() => self.id === id
      ? {
          id: self.id,
          username: self.username,
        }
      : userCache.get(id))
    return { abort, data }
  }

  return {
    self,
    clear,
    getInfo,
  }
})
