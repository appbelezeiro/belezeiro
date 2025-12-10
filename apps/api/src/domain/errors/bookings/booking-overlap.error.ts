import { DomainError } from './domain-error';

export class BookingOverlapError extends DomainError {
  constructor(message: string = 'Booking overlap detected') {
    super(message);
  }
}
