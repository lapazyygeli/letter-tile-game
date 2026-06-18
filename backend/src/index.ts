import { app } from './app.ts'
import dotenv from 'dotenv'
import { initDatabase } from './db/init.ts'
import { requireEnv } from './util/get-env.ts'

// This process.env.APP_MODE is obtained from the npm run command,
// dotenv config just loads the new variables from the .env file to process.env.
const APP_MODE = process.env.APP_MODE || 'development'
dotenv.config({ path: `.env.${APP_MODE}` })

try {
  await initDatabase()
  const PORT = requireEnv(process.env.SERVER_PORT)
  app.listen(PORT)
  console.info(`express server running on http://localhost:${PORT}`)
} catch (err) {
  console.log('error connecting to database:', err)
}
