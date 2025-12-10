import { DomainError } from '@/domain/errors/domain-error';

export class BookingInPastError extends DomainError {
  constructor(message: string = 'Cannot create booking in the past') {
    super(message);
  }
}
