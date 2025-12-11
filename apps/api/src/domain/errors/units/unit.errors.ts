import { DomainError } from '@/domain/errors/domain-error';

export class UnitNotFoundError extends DomainError {
  constructor(message: string = 'Unit not found') {
    super(message);
  }
}

export class InvalidWorkingHoursError extends DomainError {
  constructor(message: string = 'Invalid working hours') {
    super(message);
  }
}

export class InvalidCepError extends DomainError {
  constructor(message: string = 'Invalid CEP format') {
    super(message);
  }
}

export class InvalidPhoneError extends DomainError {
  constructor(message: string = 'Invalid phone format') {
    super(message);
  }
}

export class InvalidServiceTypeError extends DomainError {
  constructor(message: string = 'Invalid service type') {
    super(message);
  }
}

export class InvalidEspecialidadeError extends DomainError {
  constructor(message: string = 'Invalid especialidade ID') {
    super(message);
  }
}

export class InvalidServiceError extends DomainError {
  constructor(message: string = 'Invalid service ID') {
    super(message);
  }
}

export class InvalidAmenityError extends DomainError {
  constructor(message: string = 'Invalid amenity ID') {
    super(message);
  }
}

export class InvalidBrandColorError extends DomainError {
  constructor(message: string = 'Invalid brand color') {
    super(message);
  }
}
