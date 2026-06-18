import jwt from 'jsonwebtoken'
import { userRepository } from '../repositories/user.repository.ts'
import { requireEnv } from '../util/get-env.ts'
import { AuthenticationError } from '../errors/AuthenticationError.ts'
import type { LoginReqBody, SignupReqBody } from '../routes/user.route.ts'
import { User } from '../db/models/user.model.ts'
import { RegistrationError } from '../errors/RegistrationError.ts'

export async function authenticateUser({ username, password }: LoginReqBody) {
  // TODO: compare hashes
  const user = await userRepository.getUser({ username })
  if (!user || user.password !== password) {
    throw new AuthenticationError()
  }
  const payload = { sub: user._id, name: user.username }
  const secret = requireEnv(process.env.JWT_ACCESS_TOKEN_SECRET)
  const token = jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: '15m',
  })
  return token
}

export async function registerUser({ username, password }: SignupReqBody) {
  const existingUser = await userRepository.getUser({ username })
  if (existingUser) {
    throw new RegistrationError()
  }
  const newUser = await userRepository.createUser({ username, password })
  return newUser
}
