import { DomainError } from '@/domain/errors/domain-error';

export class RuleNotFoundError extends DomainError {
  constructor(message: string = 'Booking rule not found') {
    super(message);
  }
}
