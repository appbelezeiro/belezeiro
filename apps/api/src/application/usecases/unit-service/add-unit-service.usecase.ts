import { UnitServiceEntity } from '@/domain/entities/unit-service.entity';
import { IUnitServiceRepository } from '@/application/contracts/i-unit-service-repository.interface';
import { IServiceRepository } from '@/application/contracts/i-service-repository.interface';
import { IUnitRepository } from '@/application/contracts/i-unit-repository.interface';
import { UnitServiceAlreadyAddedError } from '@/domain/errors/unit-service-already-added.error';
import { ServiceNotFoundError } from '@/domain/errors/service-not-found.error';
import { UnitNotFoundError } from '@/domain/errors/unit-not-found.error';

class UseCase {
  constructor(
    private readonly unit_service_repository: IUnitServiceRepository,
    private readonly service_repository: IServiceRepository,
    private readonly unit_repository: IUnitRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // Validate unit exists
    const unit = await this.unit_repository.find_by_id(input.unit_id);
    if (!unit) {
      throw new UnitNotFoundError(`Unit '${input.unit_id}' not found`);
    }

    // Validate service exists
    const service = await this.service_repository.find_by_id(input.service_id);
    if (!service) {
      throw new ServiceNotFoundError(`Service '${input.service_id}' not found`);
    }

    // Check if already added
    const existing = await this.unit_service_repository.find_by_unit_and_service(
      input.unit_id,
      input.service_id
    );
    if (existing) {
      throw new UnitServiceAlreadyAddedError(input.unit_id, input.service_id);
    }

    const unit_service = new UnitServiceEntity({
      unit_id: input.unit_id,
      service_id: input.service_id,
      custom_price_cents: input.custom_price_cents,
      custom_duration_minutes: input.custom_duration_minutes,
    });

    return this.unit_service_repository.create(unit_service);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    service_id: string;
    custom_price_cents?: number;
    custom_duration_minutes?: number;
  };

  export type Output = Promise<UnitServiceEntity>;
}

export { UseCase as AddUnitServiceUseCase };
