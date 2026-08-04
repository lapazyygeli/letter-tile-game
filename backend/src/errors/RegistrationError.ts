import { AppError } from './AppError.ts'

export class RegistrationError extends AppError {
  constructor(message: string = 'Registration failed') {
    // 400 Bad Request: Server cannot process the request due to client error
    // or "client provided bad data"
    super(400, message)
    this.name = 'RegistrationError'
  }
}
