import type { Express, NextFunction, Request, Response } from 'express'
import { authenticateUser, registerUser } from '../services/user.service.ts'

export type SignupReqBody = {
  username: string
  password: string
}

export type LoginReqBody = {
  username: string
  password: string
}

export async function userRoutes(app: Express) {
  app.post(
    '/api/v1/user/signup',
    async (
      req: Request<{}, {}, SignupReqBody>,
      res: Response,
      next: NextFunction,
    ) => {
      // {} means: any value except null or undefined
      try {
        const user = await registerUser(req.body)
        return res.status(201).json({ username: user.username })
      } catch (err) {
        next(err)
      }
    },
  )
  app.post(
    '/api/v1/user/login',
    async (
      req: Request<{}, {}, LoginReqBody>,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const jwt = await authenticateUser(req.body)
        return res.status(200).json({ token: jwt })
      } catch (err) {
        next(err)
      }
    },
  )
}
