import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

/**
 * Validate the body of the request. Throw 400 if body
 * doesn't match to the correct schema and return error
 * message to the client. Otherwise set validated body
 * to req.body
 * @param schema | define how to body should look like
 */
export function validate(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? 'Invalid request body'
      res.status(400).json({ message })
      return
    }
    // Set validated data to req body
    req.body = result.data
    next()
  }
}
