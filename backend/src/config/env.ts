import dotenv from 'dotenv'
import { z } from 'zod'

// This process.env.APP_MODE is obtained from the npm run command,
// dotenv config just loads the new variables from the .env file to process.env.
const APP_MODE = process.env.APP_MODE ?? 'development'
dotenv.config({ path: `.env.${APP_MODE}` })

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: z
    .url()
    .refine(
      (v) => new URL(v).origin === v,
      'must be an origin without trailing slash',
    ),
  JWT_ACCESS_TOKEN_SECRET: z.string().min(32),
  // Number of reverse proxies in front of the app
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),
})

const result = envSchema.safeParse({ ...process.env })

if (!result.success) {
  // Field names and messages only, values are secrets.
  console.error(
    'Invalid environment:',
    z.flattenError(result.error).fieldErrors,
  )
  process.exit(1)
}

export const env = result.data
