import { DomainError } from './domain-error';

export class AmenityCodeAlreadyExistsError extends DomainError {
  constructor(code: string) {
    super(`Amenity with code '${code}' already exists`);
  }
}
