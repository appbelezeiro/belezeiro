import { IServiceRepository } from '@/application/contracts/i-service-repository.interface';
import { CursorPaginatedResponse } from '@/application/types/cursor-pagination.types';
import { ServiceEntity } from '@/domain/entities/service.entity';

class UseCase {
  constructor(private readonly service_repository: IServiceRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.service_repository.list(input.specialty_id, input.cursor, input.limit);
  }
}

declare namespace UseCase {
  export type Input = {
    specialty_id?: string;
    cursor?: string;
    limit?: number;
  };

  export type Output = Promise<CursorPaginatedResponse<ServiceEntity>>;
}

export { UseCase as ListServicesUseCase };
