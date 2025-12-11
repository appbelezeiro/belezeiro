import { DomainError } from './domain-error';

export class SpecialtyNotFoundError extends DomainError {
  constructor(message: string = 'Specialty not found') {
    super(message);
  }
}
