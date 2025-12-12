import { DomainError } from "../domain-error";

export class OneOrMoreAmenitiesNotFound extends DomainError {
  constructor() {
    super(`We're passed a set of amenity IDs but one or more could not be found.`);
  }
}
