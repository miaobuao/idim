import { bcrypt, bcryptVerify as verify } from 'hash-wasm'
import { randomBytes } from 'node:crypto'

export function bcryptEncrypt(password: string) {
  return bcrypt({
    password,
    salt: randomBytes(16),
    costFactor: 13,
    outputType: 'encoded',
  })
}

export function bcryptVerify(password: string, hashed: string) {
  return verify({
    password,
    hash: hashed,
  })
}
