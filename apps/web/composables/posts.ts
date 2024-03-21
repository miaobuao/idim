import dayjs from '../utils/dayjs'
import { Batcher } from '~/utils/batcher'
import { useTrpc } from '~/utils/uses'

export interface PostDto {
  id: number
  title: string
  content: string
  ctime: dayjs.Dayjs
  mtime: dayjs.Dayjs
  author: {
    id: number
    username: string
  }
}

const batch = new Batcher(750)

export const usePostsStore = defineStore('posts', () => {
  const posts = reactive<Map<number, PostDto>>(new Map())
  const offsetMap = reactive<Map<number, number>>(new Map())
  const total = ref(-1)
  const queryByOffsetPendingMap: Map<number, boolean> = new Map()
  const queryByIdPendingMap: Map<number, boolean> = new Map()

  async function refresh() {
    const $trpc = useTrpc()
    total.value = await $trpc.post.count.query()
  }

  function get(id: number) {
    batch.start()
    const abort = batch.push(() => {
      if (posts.has(id) || queryByIdPendingMap.has(id))
        return
      queryByIdPendingMap.set(id, true)

      const $trpc = useTrpc()
      $trpc.post.get.query(id)
        .then(post => posts.set(post.id, {
          ...post,
          ctime: dayjs(post.ctime),
          mtime: dayjs(post.mtime),
        }))
        .catch(errorHandler)
        .finally(() => queryByIdPendingMap.delete(id))
    })
    return {
      abort,
      data: computed(() => posts.get(id)),
    }
  }

  function getByOffset(offset: number) {
    batch.start()
    const abort = batch.push(() => {
      if (offsetMap.has(offset) || queryByOffsetPendingMap.has(offset))
        return
      queryByOffsetPendingMap.set(offset, true)

      const $trpc = useTrpc()
      $trpc.post.getByOffset.query(offset)
        .then((post) => {
          offsetMap.set(offset, post.id)
          posts.set(post.id, {
            ...post,
            ctime: dayjs(post.ctime),
            mtime: dayjs(post.mtime),
          })
        })
        .catch(errorHandler)
        .finally(() => queryByOffsetPendingMap.delete(offset))
    })
    const data = computed(() => {
      if (offsetMap.has(offset))
        return posts.get(offsetMap.get(offset)!)
      return undefined
    })
    return { abort, data }
  }

  return {
    get,
    getByOffset,
    refresh,
    total: computed(() => total.value),
  }
})
