import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { requireEnv } from './get-env.ts'

const ACCESS_TOKEN_TTL = '15m'

export function generateToken(): string {
  // One hex takes 4 bits. This results to 128 chars
  return crypto.randomBytes(64).toString('hex')
}

export function hashToken(plainToken: string): string {
  return crypto.createHash('sha256').update(plainToken).digest('hex')
}

export function issueAccessToken(userId: string, username: string): string {
  const secret = requireEnv(process.env.JWT_ACCESS_TOKEN_SECRET)
  const payload = { sub: userId, name: username }
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: ACCESS_TOKEN_TTL,
  })
}
