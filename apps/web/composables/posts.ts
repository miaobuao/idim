import dayjs from 'dayjs'

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

export const usePostsStore = defineStore('posts', () => {
  const posts = reactive<Map<number, PostDto>>(new Map())
  const offsetMap = reactive<Map<number, number>>(new Map())
  const total = ref(-1)

  async function refresh() {
    const { $trpc } = useNuxtApp()
    total.value = await $trpc.post.count.query()
  }

  function get(id: number) {
    if (!posts.has(id)) {
      const { $trpc } = useNuxtApp()
      $trpc.post.get.query(id)
        .then(post => posts.set(post.id, {
          ...post,
          ctime: dayjs(post.ctime),
          mtime: dayjs(post.mtime),
        }))
        .catch(errorHandler)
    }
    return computed(() => posts.get(id))
  }

  function getByOffset(offset: number) {
    if (!offsetMap.has(offset)) {
      const { $trpc } = useNuxtApp()
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
    }
    return computed(() => {
      if (offsetMap.has(offset))
        return posts.get(offsetMap.get(offset)!)
      return undefined
    })
  }

  return {
    get,
    getByOffset,
    refresh,
    total: computed(() => total.value),
  }
})
