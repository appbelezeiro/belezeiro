import { DomainError } from './domain-error';

export class UnitSpecialtyAlreadyLinkedError extends DomainError {
  constructor(unitId: string, specialtyId: string) {
    super(`Unit '${unitId}' is already linked to specialty '${specialtyId}'`);
  }
}
