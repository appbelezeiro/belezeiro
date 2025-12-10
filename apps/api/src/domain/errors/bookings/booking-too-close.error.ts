import { DomainError } from '@/domain/errors/domain-error';

export class BookingTooCloseError extends DomainError {
  constructor(message: string = 'Booking does not meet minimum advance time requirement') {
    super(message);
  }
}
