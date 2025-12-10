import { DomainError } from '@/domain/errors/domain-error';

export class OrganizationNotFoundError extends DomainError {
  constructor(message: string = 'Organization not found') {
    super(message);
  }
}

export class OrganizationAlreadyExistsError extends DomainError {
  constructor(message: string = 'Organization already exists') {
    super(message);
  }
}

export class InvalidBusinessNameError extends DomainError {
  constructor(message: string = 'Invalid business name') {
    super(message);
  }
}

export class InvalidBrandColorError extends DomainError {
  constructor(message: string = 'Invalid brand color') {
    super(message);
  }
}
