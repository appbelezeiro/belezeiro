import { DomainError } from './domain-error';

export class ServiceCodeAlreadyExistsError extends DomainError {
  constructor(code: string) {
    super(`Service with code '${code}' already exists`);
  }
}
