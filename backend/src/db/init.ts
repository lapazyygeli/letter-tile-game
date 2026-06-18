import mongoose from 'mongoose'
import { requireEnv } from '../util/get-env.ts'

export async function initDatabase() {
  const DATABASE_URL = requireEnv(process.env.DATABASE_URL)
  mongoose.connection.on('open', () => {
    console.info('successfully connected to database:', DATABASE_URL)
  })
  await mongoose.connect(DATABASE_URL)
}
