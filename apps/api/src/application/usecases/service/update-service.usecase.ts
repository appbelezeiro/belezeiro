import { ServiceEntity } from '@/domain/entities/service.entity';
import { IServiceRepository } from '@/application/contracts/i-service-repository.interface';
import { ServiceNotFoundError } from '@/domain/errors/service-not-found.error';

class UseCase {
  constructor(private readonly service_repository: IServiceRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const service = await this.service_repository.find_by_id(input.id);
    if (!service) {
      throw new ServiceNotFoundError(`Service '${input.id}' not found`);
    }

    if (input.name !== undefined) {
      service.update_name(input.name);
    }

    if (input.description !== undefined) {
      service.update_description(input.description);
    }

    if (input.default_duration_minutes !== undefined) {
      service.update_default_duration(input.default_duration_minutes);
    }

    if (input.default_price_cents !== undefined) {
      service.update_default_price(input.default_price_cents);
    }

    if (input.is_active !== undefined) {
      if (input.is_active) {
        service.activate();
      } else {
        service.deactivate();
      }
    }

    return this.service_repository.update(service);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
    name?: string;
    description?: string;
    default_duration_minutes?: number;
    default_price_cents?: number;
    is_active?: boolean;
  };

  export type Output = Promise<ServiceEntity>;
}

export { UseCase as UpdateServiceUseCase };
