import { DomainError } from '@/domain/errors/domain-error';

export class TemplateNotFoundError extends DomainError {
  constructor(message: string = 'Template not found') {
    super(message);
  }
}
