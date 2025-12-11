import { DomainError } from './domain-error';

export class SpecialtyCodeAlreadyExistsError extends DomainError {
  constructor(code: string) {
    super(`Specialty with code '${code}' already exists`);
  }
}
