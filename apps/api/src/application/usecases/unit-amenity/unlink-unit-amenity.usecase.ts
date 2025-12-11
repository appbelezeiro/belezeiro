import { IUnitAmenityRepository } from '@/application/contracts/i-unit-amenity-repository.interface';

class UseCase {
  constructor(private readonly unit_amenity_repository: IUnitAmenityRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.unit_amenity_repository.delete(input.unit_id, input.amenity_id);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    amenity_id: string;
  };

  export type Output = Promise<boolean>;
}

export { UseCase as UnlinkUnitAmenityUseCase };
