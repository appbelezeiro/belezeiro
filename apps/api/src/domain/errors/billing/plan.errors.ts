import { DomainError } from '@/domain/errors/domain-error';

export class PlanNotFoundError extends DomainError {
  constructor(message: string = 'Plan not found') {
    super(message);
  }
}

export class PlanNotActiveError extends DomainError {
  constructor(message: string = 'Plan is not active') {
    super(message);
  }
}

export class PlanInvalidPriceError extends DomainError {
  constructor(message: string = 'Invalid plan price') {
    super(message);
  }
}
