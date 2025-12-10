import { DomainError } from '@/domain/errors/domain-error';

export class DailyBookingLimitExceededError extends DomainError {
  constructor(message: string = 'Daily booking limit exceeded for this user') {
    super(message);
  }
}
