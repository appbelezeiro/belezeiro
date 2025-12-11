import { DomainError } from '../domain-error';

export class InvalidFileTypeError extends DomainError {
  constructor(message: string = 'Invalid file type') {
    super(message);
  }
}

export class FileSizeExceededError extends DomainError {
  constructor(message: string = 'File size exceeded') {
    super(message);
  }
}

export class StorageQuotaExceededError extends DomainError {
  constructor(message: string = 'Storage quota exceeded') {
    super(message);
  }
}

export class FileNotFoundError extends DomainError {
  constructor(message: string = 'File not found') {
    super(message);
  }
}
