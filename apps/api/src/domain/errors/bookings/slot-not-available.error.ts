import { DomainError } from './domain-error';

export class SlotNotAvailableError extends DomainError {
  constructor(message: string = 'Slot not available') {
    super(message);
  }
}
