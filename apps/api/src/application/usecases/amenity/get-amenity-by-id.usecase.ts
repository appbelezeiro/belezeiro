import { AmenityEntity } from '@/domain/entities/amenity.entity';
import { IAmenityRepository } from '@/application/contracts/i-amenity-repository.interface';

class UseCase {
  constructor(private readonly amenity_repository: IAmenityRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.amenity_repository.find_by_id(input.id);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
  };

  export type Output = Promise<AmenityEntity | null>;
}

export { UseCase as GetAmenityByIdUseCase };
