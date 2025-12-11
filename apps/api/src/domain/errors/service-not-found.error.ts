import { DomainError } from './domain-error';

export class ServiceNotFoundError extends DomainError {
  constructor(message: string = 'Service not found') {
    super(message);
  }
}
