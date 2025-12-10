import { DomainError } from '@/domain/errors/domain-error';

export class InvalidChannelError extends DomainError {
  constructor(message: string = 'Invalid notification channel') {
    super(message);
  }
}
