import { DomainError } from '@/domain/errors/domain-error';

export class BookingInvalidDurationForSlotError extends DomainError {
  constructor(message: string = 'Booking duration must be a multiple of slot duration') {
    super(message);
  }
}
