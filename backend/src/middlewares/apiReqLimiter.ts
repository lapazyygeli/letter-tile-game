import type { NextFunction, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'

export const apiReqLimiter =
  process.env.NODE_ENV === 'production'
    ? rateLimit({
        windowMs: 1000 * 60 * 15,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
        message: { message: 'Too many requests, please try again later' },
      })
    : (_req: Request, _res: Response, next: NextFunction) => next()
