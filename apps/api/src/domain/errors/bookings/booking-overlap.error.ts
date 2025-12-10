import { DomainError } from '@/domain/errors/domain-error';

export class BookingOverlapError extends DomainError {
  constructor(message: string = 'Booking overlap detected') {
    super(message);
  }
}
