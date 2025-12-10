import { DomainError } from '@/domain/errors/domain-error';

export class SubscriptionNotFoundError extends DomainError {
  constructor(message: string = 'Subscription not found') {
    super(message);
  }
}

export class SubscriptionAlreadyActiveError extends DomainError {
  constructor(message: string = 'Subscription is already active') {
    super(message);
  }
}

export class SubscriptionAlreadyCanceledError extends DomainError {
  constructor(message: string = 'Subscription is already canceled') {
    super(message);
  }
}

export class SubscriptionCannotBeReactivatedError extends DomainError {
  constructor(message: string = 'Subscription cannot be reactivated') {
    super(message);
  }
}

export class SubscriptionInvalidStatusError extends DomainError {
  constructor(message: string = 'Invalid subscription status') {
    super(message);
  }
}
