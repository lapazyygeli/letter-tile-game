import type { Express, NextFunction, Request, Response } from 'express'
import { requireAuth } from '../middlewares/requireAuth.ts'
import { validate } from '../middlewares/validateReqBody.ts'
import {
  saveGameStatsSchema,
  type SaveGameStatsBody,
} from '../schemas/game-stats.schema.ts'
import {
  saveGameStats,
  getMyStatistics,
  getLeaderboard,
} from '../services/game-stats.service.ts'

export async function gameStatsRoutes(app: Express) {
  // Save the result of a completed game. Guests never reach this. They
  // hold no access token, so requireAuth rejects them before this handler
  // ever runs (if even called).
  app.post(
    '/api/v1/stats',
    requireAuth,
    validate(saveGameStatsSchema),
    async (
      req: Request<{}, {}, SaveGameStatsBody>,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        await saveGameStats(req.auth!.sub, req.body)
        return res.status(201).json({ message: 'Statistics saved' })
      } catch (err) {
        next(err)
      }
    },
  )

  // The signed-in player's own statistics.
  app.get(
    '/api/v1/stats/me',
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const statistics = await getMyStatistics(req.auth!.sub)
        return res.status(200).json(statistics)
      } catch (err) {
        next(err)
      }
    },
  )

  // Cross-user rankings, singleplayer only for now.
  app.get(
    '/api/v1/stats/leaderboard',
    requireAuth,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const leaderboard = await getLeaderboard('singleplayer')
        return res.status(200).json(leaderboard)
      } catch (err) {
        next(err)
      }
    },
  )
}
