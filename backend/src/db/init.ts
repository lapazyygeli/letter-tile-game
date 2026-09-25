import mongoose from 'mongoose'
import { env } from '../config/env.ts'

export async function initDatabase() {
  mongoose.set('sanitizeFilter', true)
  await mongoose.connect(env.DATABASE_URL, { serverSelectionTimeoutMS: 10_000 })
  console.info('connected to database')
}
