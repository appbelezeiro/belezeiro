import { SpecialtyEntity } from '@/domain/entities/specialty.entity';
import { ISpecialtyRepository } from '@/application/contracts/i-specialty-repository.interface';
import { SpecialtyCodeAlreadyExistsError } from '@/domain/errors/specialty-code-already-exists.error';

class UseCase {
  constructor(private readonly specialty_repository: ISpecialtyRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // Check if code already exists
    const existing = await this.specialty_repository.find_by_code(input.code);
    if (existing) {
      throw new SpecialtyCodeAlreadyExistsError(input.code);
    }

    const specialty = new SpecialtyEntity({
      code: input.code,
      name: input.name,
      description: input.description,
      icon: input.icon,
      is_predefined: false, // Custom specialties created by users
    });

    return this.specialty_repository.create(specialty);
  }
}

declare namespace UseCase {
  export type Input = {
    code: string;
    name: string;
    description?: string;
    icon: string;
  };

  export type Output = Promise<SpecialtyEntity>;
}

export { UseCase as CreateSpecialtyUseCase };
