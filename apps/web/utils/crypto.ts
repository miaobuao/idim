import { argon2id } from 'hash-wasm'

export function argon2idEncrypt(text: string) {
  const config = useRuntimeConfig()
  return argon2id({
    parallelism: 16,
    memorySize: 1024 * 50,
    hashLength: 256,
    iterations: 24,
    password: text,
    salt: config.public.WEB_HASH_SALT,
  })
}
