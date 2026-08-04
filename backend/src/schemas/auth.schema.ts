import { z } from 'zod'

export const signupSchema = z.object({
  username: z
    .string({ error: 'Username must be a string' })
    .trim()
    .min(1, 'Username is required')
    .max(30, 'Username must be at most 30 characters'),
  password: z
    .string({ error: 'Password must be a string' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
})

export const loginSchema = z.object({
  username: z
    .string({ error: 'Username must be a string' })
    .trim()
    .min(1, 'Username is required')
    .max(100),
  password: z
    .string({ error: 'Password must be a string' })
    .min(1, 'Password is required')
    .max(128),
})

export type SignupBody = z.infer<typeof signupSchema>
export type LoginBody = z.infer<typeof loginSchema>
