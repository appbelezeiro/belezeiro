import { DomainError } from '@/domain/errors/domain-error';

export class CustomerNotFoundError extends DomainError {
  constructor(message: string = 'Customer not found') {
    super(message);
  }
}

export class CustomerAlreadyExistsError extends DomainError {
  constructor(message: string = 'Customer already exists for this user and unit') {
    super(message);
  }
}
