import { IAmenityRepository } from '@/application/contracts/i-amenity-repository.interface';
import { CursorPaginatedResponse } from '@/application/types/cursor-pagination.types';
import { AmenityEntity } from '@/domain/entities/amenity.entity';

class UseCase {
  constructor(private readonly amenity_repository: IAmenityRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.amenity_repository.list(input.cursor, input.limit);
  }
}

declare namespace UseCase {
  export type Input = {
    cursor?: string;
    limit?: number;
  };

  export type Output = Promise<CursorPaginatedResponse<AmenityEntity>>;
}

export { UseCase as ListAmenitiesUseCase };
