import { DomainError } from './domain-error';

export class BookingExceedsMaxDurationError extends DomainError {
  constructor(message: string = 'Booking duration exceeds maximum allowed duration') {
    super(message);
  }
}
