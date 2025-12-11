import { AmenityEntity } from '@/domain/entities/amenity.entity';
import { IAmenityRepository } from '@/application/contracts/i-amenity-repository.interface';
import { AmenityNotFoundError } from '@/domain/errors/amenity-not-found.error';

class UseCase {
  constructor(private readonly amenity_repository: IAmenityRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const amenity = await this.amenity_repository.find_by_id(input.id);
    if (!amenity) {
      throw new AmenityNotFoundError(`Amenity with id '${input.id}' not found`);
    }

    amenity.deactivate();

    return this.amenity_repository.update(amenity);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
  };

  export type Output = Promise<AmenityEntity>;
}

export { UseCase as DeactivateAmenityUseCase };
