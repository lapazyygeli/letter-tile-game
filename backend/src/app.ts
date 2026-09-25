import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.ts'
import { authRoutes } from './routes/auth.route.ts'
import { apiReqLimiter } from './middlewares/apiReqLimiter.ts'
import helmet from 'helmet'
import { gameStatsRoutes } from './routes/game-stats.route.ts'
import { env } from './config/env.ts'

const app = express()

app.set('trust proxy', env.TRUST_PROXY)
app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(apiReqLimiter)
app.use(express.json({ limit: '50kb' }))
app.use(cookieParser())

authRoutes(app)
gameStatsRoutes(app)

app.use((_req, res) => {
  res.status(404).json({
    message: 'Not found',
  })
})

app.use(errorHandler)

export { app }
