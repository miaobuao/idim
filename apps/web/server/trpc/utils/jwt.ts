import {
  type JWTPayload as BaseJwtPayload,
  SignJWT,
  jwtVerify,
} from 'jose'

import config from './config'

const secret = new TextEncoder().encode(config.JWT_SECRET)

export async function signToken(payload: JwtPayloadData) {
  return await new SignJWT({ data: payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(config.JWT_ISSUER)
    .setExpirationTime(config.OAUTH_JWT_EXPIRES_IN)
    .sign(secret)
}

export function verifyToken(token: string) {
  return jwtVerify<JwtPayload>(token, secret, {
    issuer: config.JWT_ISSUER,
  })
}

export interface JwtPayload extends BaseJwtPayload {
  data: JwtPayloadData
}

export interface JwtPayloadData {
  id: number
}
