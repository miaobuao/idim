import { argon2id, sha512 } from 'hash-wasm'

globalThis.onmessage = async ({ data }) => {
  globalThis.postMessage(await argon2id({
    parallelism: 24,
    memorySize: 1024 * 64,
    hashLength: 36,
    iterations: 24,
    password: data,
    salt: await sha512(data),
  }))
}
