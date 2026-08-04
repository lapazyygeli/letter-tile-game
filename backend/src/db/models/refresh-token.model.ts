import mongoose, { Schema } from 'mongoose'

const refreshTokenSchema = new Schema({
  tokenHash: { type: String, required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
})

// TTL index: automatically remove expired refresh tokens based on the expiresAt field.
// {expiresAt: 1} --> rows in asc order (the smallest time in the most highest row)
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)
