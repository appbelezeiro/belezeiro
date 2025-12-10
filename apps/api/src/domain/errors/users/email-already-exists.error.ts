import { DomainError } from '@/domain/errors/domain-error';

export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`Email ${email} is already registered`);
  }
}
