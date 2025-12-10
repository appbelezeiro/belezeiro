import { DomainError } from '@/domain/errors/domain-error';

export class BookingNotFoundError extends DomainError {
  constructor(message: string = 'Booking not found') {
    super(message);
  }
}
