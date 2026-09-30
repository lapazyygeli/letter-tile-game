import bcrypt from 'bcrypt'
import { userRepository } from '../repositories/user.repository.ts'
import { AuthenticationError } from '../errors/AuthenticationError.ts'
import { refreshTokenRepository } from '../repositories/refresh-token.repository.ts'
import { generateToken, hashToken, issueAccessToken } from '../util/token.ts'
import { REFRESH_TOKEN_TTL_MS } from '../config/constants.ts'
import { ConflictError } from '../errors/ConflictError.ts'
import { isDuplicateKeyError } from '../util/db.ts'
import type { LoginBody, SignupBody } from '../schemas/auth.schema.ts'

const SALT_ROUNDS = 12

// Use a dummy hash when the user does not exist,
// so bcrypt still runs and does not reveal valid usernames through timing.
const DUMMY_PASSWORD_HASH = await bcrypt.hash(generateToken(), SALT_ROUNDS)

export async function registerUser({ username, password }: SignupBody) {
  const existingUser = await userRepository.getUser({ username })
  if (existingUser) {
    throw new ConflictError('Username is not available')
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  try {
    await userRepository.createUser({ username, password: hashedPassword })
  } catch (err) {
    if (isDuplicateKeyError(err))
      throw new ConflictError('Username is not available')
    throw err
  }
}

export async function authenticateUser({ username, password }: LoginBody) {
  const user = await userRepository.getUser({ username })

  const isPasswordMatch = await bcrypt.compare(
    password,
    user?.password ?? DUMMY_PASSWORD_HASH,
  )
  if (!user || !isPasswordMatch) throw new AuthenticationError()

  const userId = user._id.toString()
  const plainRefreshToken = generateToken()

  await refreshTokenRepository.createRefreshToken({
    tokenHash: hashToken(plainRefreshToken),
    userId: userId,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  })

  return {
    accessToken: issueAccessToken(userId, user.username),
    refreshToken: plainRefreshToken,
  }
}

export async function refreshAccessToken(plainToken: string) {
  const storedRefreshToken = await refreshTokenRepository.findRefreshToken(
    hashToken(plainToken),
  )
  if (!storedRefreshToken || storedRefreshToken.expiresAt < new Date()) {
    throw new AuthenticationError()
  }
  const user = await userRepository.getUser({
    userId: storedRefreshToken.userId,
  })
  if (!user) throw new AuthenticationError()
  return { accessToken: issueAccessToken(user._id.toString(), user.username) }
}

export async function logoutUser(plainToken: string) {
  await refreshTokenRepository.deleteRefreshToken(hashToken(plainToken))
}
