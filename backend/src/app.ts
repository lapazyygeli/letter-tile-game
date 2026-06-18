import express from 'express'
import cors from 'cors'
import { userRoutes } from './routes/user.route.ts'
import { errorHandler } from './middlewares/errorHandler.ts'

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
)
app.use(express.json())

userRoutes(app)
app.get('/', (req, res) => {
  res.send('Hi there!')
})
app.use(errorHandler)

export { app }
