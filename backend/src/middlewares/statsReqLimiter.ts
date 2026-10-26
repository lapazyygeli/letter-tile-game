import type { NextFunction, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import { env } from '../config/env.ts'

// Limits saved games per account instead of per IP. A real game takes
// minutes, so this only stops scripted submissions from flooding the stats
// collection and the "most games completed" leaderboard.
// Must run after requireAuth, which sets req.auth.
export const statsReqLimiter =
  env.NODE_ENV === 'production'
    ? rateLimit({
        windowMs: 1000 * 60 * 15,
        limit: 20,
        keyGenerator: (req) => req.auth!.sub,
        standardHeaders: true,
        legacyHeaders: false,
        message: { message: 'Too many requests, please try again later' },
      })
    : (_req: Request, _res: Response, next: NextFunction) => next()
