import { AmenityEntity } from '@/domain/entities/amenity.entity';
import { IAmenityRepository } from '@/application/contracts/i-amenity-repository.interface';
import { AmenityCodeAlreadyExistsError } from '@/domain/errors/amenity-code-already-exists.error';

class UseCase {
  constructor(private readonly amenity_repository: IAmenityRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // Check if code already exists
    const existing = await this.amenity_repository.find_by_code(input.code);
    if (existing) {
      throw new AmenityCodeAlreadyExistsError(input.code);
    }

    const amenity = new AmenityEntity({
      code: input.code,
      name: input.name,
      description: input.description,
      icon: input.icon,
      is_predefined: false, // Custom amenities created by users
    });

    return this.amenity_repository.create(amenity);
  }
}

declare namespace UseCase {
  export type Input = {
    code: string;
    name: string;
    description?: string;
    icon: string;
  };

  export type Output = Promise<AmenityEntity>;
}

export { UseCase as CreateAmenityUseCase };
