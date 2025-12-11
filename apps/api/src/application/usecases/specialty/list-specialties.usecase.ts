import { ISpecialtyRepository } from '@/application/contracts/i-specialty-repository.interface';
import { CursorPaginatedResponse } from '@/application/types/cursor-pagination.types';
import { SpecialtyEntity } from '@/domain/entities/specialty.entity';

class UseCase {
  constructor(private readonly specialty_repository: ISpecialtyRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.specialty_repository.list(input.cursor, input.limit);
  }
}

declare namespace UseCase {
  export type Input = {
    cursor?: string;
    limit?: number;
  };

  export type Output = Promise<CursorPaginatedResponse<SpecialtyEntity>>;
}

export { UseCase as ListSpecialtiesUseCase };
