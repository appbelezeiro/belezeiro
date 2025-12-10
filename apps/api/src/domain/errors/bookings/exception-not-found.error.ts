import { DomainError } from './domain-error';

export class ExceptionNotFoundError extends DomainError {
  constructor(message: string = 'Booking exception not found') {
    super(message);
  }
}
