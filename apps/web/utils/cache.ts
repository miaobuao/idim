import { type MaybePromise, addRxPlugin, createRxDatabase } from 'rxdb'
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression'
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'

addRxPlugin(RxDBMigrationPlugin)
if (process.env.NODE_ENV === 'development') {
  await import('rxdb/plugins/dev-mode').then(
    module => addRxPlugin(module.RxDBDevModePlugin),
  )
}

const storageWithKeyCompression = wrappedKeyCompressionStorage({
  storage: getRxStorageDexie(),
})

const cacheDB = await createRxDatabase({
  name: 'cache',
  storage: storageWithKeyCompression,
  multiInstance: true,
  eventReduce: true,
  ignoreDuplicate: true,
  cleanupPolicy: {},

})

cacheDB.addCollections({
  request: {
    schema: {
      title: 'Request Cache',
      version: 0,
      keyCompression: true,
      primaryKey: 'key',
      properties: {
        key: {
          type: 'string',
          maxLength: 512,
        },
        value: {
          type: 'object',
        },
        mtime: {
          type: 'number',
        },
      },
      required: [
        'key',
        'value',
        'mtime',
      ],
      type: 'object',
    },
  },
})

export function useRequestCache<T = unknown>(
  key: string,
  fetcher: () => MaybePromise<T>,
  options?: { ttl?: number, immediate?: boolean },
) {
  let requested = false
  const res = reactive({
    loading: true,
    data: undefined as T | undefined,
  })
  cacheDB.request.findOne({
    selector: {
      key,
    },
  }).$.subscribe((d) => {
    if (!d)
      return
    if (options?.ttl !== undefined && d.mtime + options.ttl > Date.now())
      update()
    res.data = d.value
    res.loading = false
  })
  function update() {
    requested = true
    res.loading = true
    return Promise.resolve(fetcher()).then((data) => {
      if (data) {
        return cacheDB.request.upsert({
          key,
          value: data,
          mtime: Date.now(),
        })
      }
    }).finally(() => {
      res.loading = false
    })
  }

  if (!requested && options?.immediate)
    update()

  return [ res, update ] as const
}
