import { Types } from 'mongoose'
import { RefreshToken } from '../db/models/refresh-token.model.ts'

async function createRefreshToken({
  tokenHash,
  userId,
  expiresAt,
}: {
  tokenHash: string
  userId: string | Types.ObjectId
  expiresAt: Date
}) {
  const refreshToken = new RefreshToken({ tokenHash, userId, expiresAt })
  return await refreshToken.save()
}

async function findRefreshToken(tokenHash: string) {
  return await RefreshToken.findOne({ tokenHash })
}

async function deleteRefreshToken(tokenHash: string) {
  return await RefreshToken.deleteOne({ tokenHash })
}

export const refreshTokenRepository = {
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
}
