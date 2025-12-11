import { AmenityEntity } from '@/domain/entities/amenity.entity';
import { IAmenityRepository } from '@/application/contracts/i-amenity-repository.interface';

class UseCase {
  constructor(private readonly amenity_repository: IAmenityRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const created: AmenityEntity[] = [];

    for (const seed of input.seeds) {
      // Check if already exists
      const existing = await this.amenity_repository.find_by_code(seed.code);

      if (!existing) {
        // Create with fixed ID
        const amenity = new AmenityEntity({
          id: `amen_${seed.code}`,
          code: seed.code,
          name: seed.name,
          description: seed.description,
          icon: seed.icon,
          is_predefined: true,
        });

        const created_amenity = await this.amenity_repository.create(amenity);
        created.push(created_amenity);
      }
    }

    return created;
  }
}

declare namespace UseCase {
  export type Input = {
    seeds: Array<{
      code: string;
      name: string;
      description?: string;
      icon: string;
    }>;
  };

  export type Output = Promise<AmenityEntity[]>;
}

export { UseCase as SeedAmenitiesUseCase };
