import { AppError } from './AppError.ts'

export class AuthenticationError extends AppError {
  constructor(message: string = 'Invalid username or password') {
    super(401, message)
    this.name = 'AuthenticationError'
  }
}
