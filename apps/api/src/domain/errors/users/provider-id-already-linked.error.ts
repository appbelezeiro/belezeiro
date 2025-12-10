import { DomainError } from '@/domain/errors/domain-error';

export class ProviderIdAlreadyLinkedError extends DomainError {
  constructor(providerId: string) {
    super(`Provider ID ${providerId} is already linked to another account`);
  }
}
