import { DomainError } from './domain-error';

export class DiscountNotFoundError extends DomainError {
  constructor(message: string = 'Discount not found') {
    super(message);
  }
}

export class DiscountExpiredError extends DomainError {
  constructor(message: string = 'Discount has expired') {
    super(message);
  }
}

export class DiscountMaxRedemptionsReachedError extends DomainError {
  constructor(message: string = 'Discount has reached maximum redemptions') {
    super(message);
  }
}

export class DiscountNotValidForUserError extends DomainError {
  constructor(message: string = 'Discount is not valid for this user') {
    super(message);
  }
}

export class DiscountAlreadyRedeemedError extends DomainError {
  constructor(message: string = 'Discount has already been redeemed by this user') {
    super(message);
  }
}

export class DiscountNotActiveError extends DomainError {
  constructor(message: string = 'Discount is not active') {
    super(message);
  }
}
