import { DomainError } from "../domain-error";

export class OneOrMoreServicesNotFound extends DomainError {
  constructor() {
    super(`We're passed a set of service IDs but one or more could not be found.`);
  }
}
