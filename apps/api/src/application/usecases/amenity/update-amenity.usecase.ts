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

    // Update fields if provided
    if (input.name !== undefined) {
      amenity.update_name(input.name);
    }

    if (input.description !== undefined) {
      amenity.update_description(input.description);
    }

    if (input.icon !== undefined) {
      amenity.update_icon(input.icon);
    }

    return this.amenity_repository.update(amenity);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
    name?: string;
    description?: string;
    icon?: string;
  };

  export type Output = Promise<AmenityEntity>;
}

export { UseCase as UpdateAmenityUseCase };
