import { UnitAmenityEntity } from '@/domain/entities/unit-amenity.entity';
import { IUnitAmenityRepository } from '@/application/contracts/i-unit-amenity-repository.interface';
import { IAmenityRepository } from '@/application/contracts/i-amenity-repository.interface';
import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface';
import { UnitAmenityAlreadyLinkedError } from '@/domain/errors/unit-amenity-already-linked.error';
import { AmenityNotFoundError } from '@/domain/errors/amenity-not-found.error';
import { UnitNotFoundError } from '@/domain/errors/units/unit.errors';

class UseCase {
  constructor(
    private readonly unit_amenity_repository: IUnitAmenityRepository,
    private readonly amenity_repository: IAmenityRepository,
    private readonly unit_repository: IUnitRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // Validate unit exists
    const unit = await this.unit_repository.find_by_id(input.unit_id);
    if (!unit) {
      throw new UnitNotFoundError(`Unit '${input.unit_id}' not found`);
    }

    // Validate amenity exists
    const amenity = await this.amenity_repository.find_by_id(input.amenity_id);
    if (!amenity) {
      throw new AmenityNotFoundError(`Amenity '${input.amenity_id}' not found`);
    }

    // Check if already linked
    const existing = await this.unit_amenity_repository.find_by_unit_and_amenity(
      input.unit_id,
      input.amenity_id
    );
    if (existing) {
      throw new UnitAmenityAlreadyLinkedError(input.unit_id, input.amenity_id);
    }

    const unit_amenity = new UnitAmenityEntity({
      unit_id: input.unit_id,
      amenity_id: input.amenity_id,
    });

    return this.unit_amenity_repository.create(unit_amenity);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    amenity_id: string;
  };

  export type Output = Promise<UnitAmenityEntity>;
}

export { UseCase as LinkUnitAmenityUseCase };
