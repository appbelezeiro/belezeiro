import { DomainError } from './domain-error';

export class ClientDailyBookingLimitExceededError extends DomainError {
  constructor(message: string = 'Daily booking limit exceeded for this client') {
    super(message);
  }
}
