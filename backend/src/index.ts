import './config/env.ts'
import { app } from './app.ts'
import { initDatabase } from './db/init.ts'
import { requireEnv } from './util/get-env.ts'

try {
  await initDatabase()
  const PORT = requireEnv(process.env.SERVER_PORT)
  app.listen(PORT)
  console.info(`express server running on http://localhost:${PORT}`)
} catch (err) {
  console.log('error connecting to database:', err)
}
