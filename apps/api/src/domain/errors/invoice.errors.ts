import { DomainError } from './domain-error';

export class InvoiceNotFoundError extends DomainError {
  constructor(message: string = 'Invoice not found') {
    super(message);
  }
}

export class InvoiceAlreadyPaidError extends DomainError {
  constructor(message: string = 'Invoice is already paid') {
    super(message);
  }
}

export class InvoiceCannotBeModifiedError extends DomainError {
  constructor(message: string = 'Invoice cannot be modified') {
    super(message);
  }
}

export class InvoiceInvalidStatusError extends DomainError {
  constructor(message: string = 'Invalid invoice status') {
    super(message);
  }
}
