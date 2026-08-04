import type { ErrorRequestHandler } from 'express'
import { AppError } from '../errors/AppError.ts'

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req,
  res,
  _next,
) => {
  //Special cases can be checked before this.
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  console.error('[Unhandled error]', err)

  return res.status(500).json({ message: 'Internal server error' })
}
