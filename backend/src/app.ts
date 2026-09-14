import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.ts'
import { authRoutes } from './routes/auth.route.ts'
import { apiReqLimiter } from './middlewares/apiReqLimiter.ts'
import helmet from 'helmet'
import { gameStatsRoutes } from './routes/game-stats.route.ts'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())
app.use(apiReqLimiter)

authRoutes(app)
gameStatsRoutes(app)

app.use((_req, res) => {
  res.status(404).json({
    message: 'Not found',
  })
})

app.use(errorHandler)

export { app }
