import { argon2id, sha512 } from 'hash-wasm'

globalThis.onmessage = async ({ data }) => {
  globalThis.postMessage(await argon2id({
    parallelism: 12,
    memorySize: 1024 * 64,
    hashLength: 36,
    iterations: 12,
    password: data,
    salt: await sha512(data),
  }))
}
