import mongoose, { Schema, type HydratedDocument } from 'mongoose'

export type IUser = {
  username: string
  password: string
}

export type UserDocument = HydratedDocument<IUser>

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

export const User = mongoose.model<IUser>('User', userSchema)
