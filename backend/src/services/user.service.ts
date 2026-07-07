import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { userRepository } from '../repositories/user.repository.ts'
import { requireEnv } from '../util/get-env.ts'
import { AuthenticationError } from '../errors/AuthenticationError.ts'
import type { LoginReqBody, SignupReqBody } from '../routes/user.route.ts'
import { RegistrationError } from '../errors/RegistrationError.ts'

const SALT_ROUNDS = 12

export async function authenticateUser({ username, password }: LoginReqBody) {
  const user = await userRepository.getUser({ username })
  if (!user) throw new AuthenticationError()

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) throw new AuthenticationError()

  const payload = { sub: user._id.toString(), name: user.username }
  const secret = requireEnv(process.env.JWT_ACCESS_TOKEN_SECRET)
  const token = jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: '15m',
  })
  return token
}

export async function registerUser({ username, password }: SignupReqBody) {
  // TODO: there could be even more and better requirements
  if (password.length < 8) {
    throw new RegistrationError('Password must be at least 8 characters')
  }
  const existingUser = await userRepository.getUser({ username })
  if (existingUser) {
    throw new RegistrationError('Username is not available')
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  const newUser = await userRepository.createUser({
    username,
    password: hashedPassword,
  })
  return newUser
}
