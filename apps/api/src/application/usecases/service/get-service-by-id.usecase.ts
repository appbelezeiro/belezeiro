import { ServiceEntity } from '@/domain/entities/service.entity';
import { IServiceRepository } from '@/application/contracts/i-service-repository.interface';

class UseCase {
  constructor(private readonly service_repository: IServiceRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.service_repository.find_by_id(input.id);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
  };

  export type Output = Promise<ServiceEntity | null>;
}

export { UseCase as GetServiceByIdUseCase };
