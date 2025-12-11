import { SpecialtyEntity } from '@/domain/entities/specialty.entity';
import { ISpecialtyRepository } from '@/application/contracts/i-specialty-repository.interface';

class UseCase {
  constructor(private readonly specialty_repository: ISpecialtyRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.specialty_repository.find_by_id(input.id);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
  };

  export type Output = Promise<SpecialtyEntity | null>;
}

export { UseCase as GetSpecialtyByIdUseCase };
