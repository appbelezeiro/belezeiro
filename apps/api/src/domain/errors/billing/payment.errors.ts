import { DomainError } from '@/domain/errors/domain-error';

export class PaymentFailedError extends DomainError {
  constructor(message: string = 'Payment failed') {
    super(message);
  }
}

export class PaymentProviderError extends DomainError {
  constructor(message: string = 'Payment provider error') {
    super(message);
  }
}

export class PaymentInsufficientFundsError extends DomainError {
  constructor(message: string = 'Insufficient funds') {
    super(message);
  }
}
