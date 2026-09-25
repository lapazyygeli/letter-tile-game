import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.ts'

type AuthPayload = {
  sub: string
  name: string
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload
    }
  }
}

// Verify the access token and attach its payload to req.auth,
// otherwise reject request.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Token missing' })
  }
  jwt.verify(
    token,
    env.JWT_ACCESS_TOKEN_SECRET,
    { algorithms: ['HS256'] },
    (err, payload) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' })
      }
      req.auth = payload as AuthPayload
      next()
    },
  )
}
