import './config/env.ts'
import { app } from './app.ts'
import { initDatabase } from './db/init.ts'
import { env } from './config/env.ts'
import mongoose from 'mongoose'

async function main() {
  await initDatabase()
  const server = app.listen(env.PORT, () => {
    console.info(`server listening on port ${env.PORT}`)
  })

  const shutdown = (signal: string) => {
    console.info(`${signal} received, shutting down`)
    server.close(async () => {
      await mongoose.disconnect()
      process.exit(0)
    })
    setTimeout(() => process.exit(1), 10_000).unref()
  }
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

main().catch((err) => {
  console.error('failed to start:', err instanceof Error ? err.message : err)
  process.exit(1)
})
