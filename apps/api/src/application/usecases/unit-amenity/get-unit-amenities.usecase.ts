import { UnitAmenityEntity } from '@/domain/entities/unit-amenity.entity';
import { IUnitAmenityRepository } from '@/application/contracts/i-unit-amenity-repository.interface';

class UseCase {
  constructor(private readonly unit_amenity_repository: IUnitAmenityRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.unit_amenity_repository.list_by_unit(input.unit_id);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
  };

  export type Output = Promise<UnitAmenityEntity[]>;
}

export { UseCase as GetUnitAmenitiesUseCase };
