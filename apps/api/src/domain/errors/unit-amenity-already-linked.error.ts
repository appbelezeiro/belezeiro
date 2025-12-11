import { DomainError } from './domain-error';

export class UnitAmenityAlreadyLinkedError extends DomainError {
  constructor(unitId: string, amenityId: string) {
    super(`Unit '${unitId}' is already linked to amenity '${amenityId}'`);
  }
}
