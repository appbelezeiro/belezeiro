import { DomainError } from './domain-error';

export class AmenityNotFoundError extends DomainError {
  constructor(message: string = 'Amenity not found') {
    super(message);
  }
}
