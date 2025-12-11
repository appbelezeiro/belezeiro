import { DomainError } from './domain-error';

export class UnitServiceAlreadyAddedError extends DomainError {
  constructor(unitId: string, serviceId: string) {
    super(`Unit '${unitId}' already has service '${serviceId}'`);
  }
}
