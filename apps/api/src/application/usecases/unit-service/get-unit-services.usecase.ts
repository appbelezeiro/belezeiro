import { IUnitServiceRepository } from '@/application/contracts/i-unit-service-repository.interface';
import { CursorPaginatedResponse } from '@/application/types/cursor-pagination.types';
import { UnitServiceEntity } from '@/domain/entities/unit-service.entity';

class UseCase {
  constructor(private readonly unit_service_repository: IUnitServiceRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.unit_service_repository.list_by_unit(input.unit_id, input.cursor, input.limit);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    cursor?: string;
    limit?: number;
  };

  export type Output = Promise<CursorPaginatedResponse<UnitServiceEntity>>;
}

export { UseCase as GetUnitServicesUseCase };
