import { DomainError } from '@/domain/errors/domain-error';

export class InvalidMoneyError extends DomainError {
  constructor(message: string = 'Invalid money value') {
    super(message);
  }
}

export class CurrencyMismatchError extends DomainError {
  constructor(message: string = 'Currency mismatch') {
    super(message);
  }
}
