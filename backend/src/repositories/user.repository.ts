import { Types } from 'mongoose'
import { User } from '../db/models/user.model.ts'

// never = no value is assignable to never type
// making arg optional = way to avoid giving any type and value
type GetUserParams =
  | { username: string; userId?: never }
  | { username?: never; userId: Types.ObjectId }

async function getUser({ username, userId }: GetUserParams) {
  if (username) return await User.findOne({ username })
  return await User.findById(userId)
}

async function createUser({
  username,
  password,
}: {
  username: string
  password: string
}) {
  const user = new User({ username, password })
  return await user.save()
}

export const userRepository = {
  getUser,
  createUser,
}
