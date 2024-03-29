import dayjs from '../utils/dayjs'
import { Batcher } from '~/utils/batcher'
import { useTrpc } from '~/utils/uses'

const batch = new Batcher(750)

export const usePostsStore = defineStore('posts', () => {
  const total = ref(-1)
  const queryByOffsetPendingMap: Map<number, boolean> = new Map()
  const queryByIdPendingMap: Map<number, boolean> = new Map()

  async function refresh() {
    const $trpc = useTrpc()
    total.value = await $trpc.post.count.query()
  }

  function get(
    id: number,
    options?: {
      duration?: number
    },
  ) {
    batch.start(options?.duration ?? undefined)
    const [ data, update ] = useRequestCache(`post-${id}`, () => {
      const $trpc = useTrpc()
      return $trpc.post.getById.query(id)
        .catch(errorHandler)
        .finally(() => queryByIdPendingMap.delete(id))
    })
    const abort = batch.push(() => {
      if (queryByIdPendingMap.has(id))
        return
      queryByIdPendingMap.set(id, true)
      update()
    })
    return {
      abort,
      data: computed(() => {
        if (data.data) {
          return {
            ...data,
            data: {
              ...data.data,
              ctime: dayjs(data.data.ctime),
              mtime: dayjs(data.data.mtime),
            },
          }
        }
        return {
          ...data,
          data: undefined,
        }
      }),
    }
  }

  function getByOffset(
    offset: number,
    options?: {
      duration?: number
    },
  ) {
    batch.start(options?.duration ?? undefined)
    const [ data, update ] = useRequestCache(`post-by-offset-${offset}`, () => {
      const $trpc = useTrpc()
      return $trpc.post.getByOffset.query(offset)
        .catch(errorHandler)
        .finally(() => queryByOffsetPendingMap.delete(offset))
    })
    const abort = batch.push(() => {
      if (queryByOffsetPendingMap.has(offset))
        return
      queryByOffsetPendingMap.set(offset, true)
      update()
    })
    return {
      abort,
      data: computed(() => {
        if (data.data) {
          return {
            ...data,
            data: {
              ...data.data,
              ctime: dayjs(data.data.ctime),
              mtime: dayjs(data.data.mtime),
            },
          }
        }
        return {
          ...data,
          data: undefined,
        }
      }),
    }
  }

  return {
    get,
    getByOffset,
    refresh,
    total: computed(() => total.value),
  }
})
