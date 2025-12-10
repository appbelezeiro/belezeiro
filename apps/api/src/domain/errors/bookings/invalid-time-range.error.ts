import { DomainError } from '@/domain/errors/domain-error';

export class InvalidTimeRangeError extends DomainError {
  constructor(message: string = 'Invalid time range') {
    super(message);
  }
}
