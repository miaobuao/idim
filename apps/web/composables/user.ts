const batcher = new Batcher(1000)

export const useUserStore = defineStore('user', () => {
  const self = reactive({
    id: -1,
    username: '',
    email: '',
    ctime: dayjs(),
  })
  const pendingMap = new Map<number, boolean>()
  function clear() {
    if (self.id < 0)
      return
    self.id = -1
    self.username = ''
    self.email = ''
  }

  function getInfo(id: number) {
    batcher.start()
    const [ data, update ] = useRequestCache(`user-${id}`, () => {
      if (id === self.id) {
        return {
          id: self.id,
          username: self.username,
        }
      }
      const $trpc = useTrpc()
      return $trpc.user.getInfo.query({
        userId: id,
      }).catch(errorHandler)
        .finally(() => {
          pendingMap.delete(id)
        })
    })
    const abort = batcher.push(async () => {
      if (pendingMap.has(id))
        return
      pendingMap.set(id, true)
      update()
    })
    if (self.id === id)
      abort()
    return { abort, data }
  }

  function updateSelf(
    value: Exclude<typeof self, 'ctime'> & { ctime: number | Date | string },
  ) {
    Object.assign(self, { ...value, ctime: dayjs(value.ctime) })
  }

  return {
    self,
    clear,
    getInfo,
    updateSelf,
  }
})
