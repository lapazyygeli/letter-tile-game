import type { Express, NextFunction, Request, Response } from 'express'
import {
  authenticateUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from '../services/auth.service.ts'
import { REFRESH_TOKEN_TTL_MS } from '../config/constants.ts'
import { authReqLimiter } from '../middlewares/authReqLimiter.ts'
import { validate } from '../middlewares/validateReqBody.ts'
import {
  loginSchema,
  signupSchema,
  type LoginBody,
  type SignupBody,
} from '../schemas/auth.schema.ts'
import { env } from '../config/env.ts'

const REFRESH_COOKIE = 'refreshToken'

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  // prevents the browser from sending the
  // cookie with cross-site requests.
  sameSite: 'strict' as const,
  maxAge: REFRESH_TOKEN_TTL_MS,
  // only send this cookie with requests to the
  // endpoint which includes this path.
  path: '/auth',
}

export async function authRoutes(app: Express) {
  // Create the new user with username and password
  app.post(
    '/auth/signup',
    authReqLimiter,
    validate(signupSchema),
    async (
      req: Request<{}, {}, SignupBody>,
      res: Response,
      next: NextFunction,
    ) => {
      // {} means: any value except null or undefined
      try {
        await registerUser(req.body)
        return res.status(201).json({ message: 'Account created successfully' })
      } catch (err) {
        next(err)
      }
    },
  )

  // Return both the new access token and the new refresh token.
  // Save the refresh token to the db and access token to in-memory.
  app.post(
    '/auth/login',
    authReqLimiter,
    validate(loginSchema),
    async (
      req: Request<{}, {}, LoginBody>,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const { accessToken, refreshToken } = await authenticateUser(req.body)
        res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions)
        return res.status(200).json({ accessToken })
      } catch (err) {
        next(err)
      }
    },
  )

  // Generate new access token based current refresh token
  app.post('/auth/refresh', async (req, res, next) => {
    try {
      const plainRefreshToken = req.cookies?.[REFRESH_COOKIE]
      if (!plainRefreshToken) {
        return res.status(401).json({ message: 'Unauthenticated' })
      }
      const { accessToken } = await refreshAccessToken(plainRefreshToken)
      return res.status(200).json({ accessToken })
    } catch (err) {
      next(err)
    }
  })

  // Remove refresh token from the db and from the browser
  app.post('/auth/logout', async (req, res) => {
    const plainRefreshToken = req.cookies?.[REFRESH_COOKIE]
    if (plainRefreshToken) await logoutUser(plainRefreshToken)
    res.clearCookie(REFRESH_COOKIE, { ...cookieOptions, maxAge: 0 })
    return res.status(200).json({ message: 'Logged out' })
  })
}
