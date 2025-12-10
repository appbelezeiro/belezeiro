import { DomainError } from './domain-error';

export class BookingTooCloseError extends DomainError {
  constructor(message: string = 'Booking does not meet minimum advance time requirement') {
    super(message);
  }
}
