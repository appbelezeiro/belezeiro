import { DomainError } from '@/domain/errors/domain-error';

export class TemplateVariablesMismatchError extends DomainError {
  constructor(message: string = 'Template variables mismatch') {
    super(message);
  }
}
