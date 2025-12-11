import { DomainError } from '../domain-error';

export class InvalidAvailabilityRuleError extends DomainError {
  constructor(message: string = 'Invalid availability rule') {
    super(message);
  }
}

export class InvalidAvailabilityExceptionError extends DomainError {
  constructor(message: string = 'Invalid availability exception') {
    super(message);
  }
}

export class AvailabilityRuleConflictError extends DomainError {
  constructor(message: string = 'Availability rule conflict detected') {
    super(message);
  }
}

export class AvailabilityRuleNotFoundError extends DomainError {
  constructor(message: string = 'Availability rule not found') {
    super(message);
  }
}

export class AvailabilityExceptionNotFoundError extends DomainError {
  constructor(message: string = 'Availability exception not found') {
    super(message);
  }
}
