import { DomainError } from "../domain-error";

export class OneOrMoreSpecialitiesNotFound extends DomainError {
  constructor() {
    super(`We're passed a set of speciality IDs but one or more could not be found.`);
  }
}
