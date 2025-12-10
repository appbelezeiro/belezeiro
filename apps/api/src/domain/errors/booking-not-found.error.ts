import { DomainError } from './domain-error';

export class BookingNotFoundError extends DomainError {
  constructor(message: string = 'Booking not found') {
    super(message);
  }
}
