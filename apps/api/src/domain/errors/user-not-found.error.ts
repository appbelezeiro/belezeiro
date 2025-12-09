import { DomainError } from './domain-error';

export class UserNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
  }
}
