import type { NextFunction, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'

export const authReqLimiter =
  process.env.NODE_ENV === 'production'
    ? rateLimit({
        windowMs: 1000 * 60 * 15, // 15m window period
        max: 15, // max request count in this window
        standardHeaders: true, // return rate-limit headers if needed
        legacyHeaders: false,
        message: { message: 'Too many requests, please try again later' },
      })
    : (_req: Request, _res: Response, next: NextFunction) => next()
