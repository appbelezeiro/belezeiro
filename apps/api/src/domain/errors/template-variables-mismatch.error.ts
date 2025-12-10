import { DomainError } from './domain-error';

export class TemplateVariablesMismatchError extends DomainError {
  constructor(message: string = 'Template variables mismatch') {
    super(message);
  }
}
