import { SpecialtyEntity } from '@/domain/entities/specialty.entity';
import { ISpecialtyRepository } from '@/application/contracts/i-specialty-repository.interface';
import { generateSeedId } from '@/domain/constants/seed-ids';

class UseCase {
  constructor(private readonly specialty_repository: ISpecialtyRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const created: SpecialtyEntity[] = [];

    for (const seed of input.seeds) {
      // Check if already exists
      const existing = await this.specialty_repository.find_by_code(seed.code);

      if (!existing) {
        // Create with deterministic ID based on code
        const specialty = new SpecialtyEntity({
          id: generateSeedId('spec', seed.code),
          code: seed.code,
          name: seed.name,
          description: seed.description,
          icon: seed.icon,
          is_predefined: true,
        });

        const created_specialty = await this.specialty_repository.create(specialty);
        created.push(created_specialty);
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

  export type Output = Promise<SpecialtyEntity[]>;
}

export { UseCase as SeedSpecialtiesUseCase };
