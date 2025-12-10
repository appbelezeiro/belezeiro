import { DomainError } from './domain-error';

export class RuleNotFoundError extends DomainError {
  constructor(message: string = 'Booking rule not found') {
    super(message);
  }
}
