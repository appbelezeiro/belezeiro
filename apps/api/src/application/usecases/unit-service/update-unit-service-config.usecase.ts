import { UnitServiceEntity } from '@/domain/entities/unit-service.entity';
import { IUnitServiceRepository } from '@/application/contracts/i-unit-service-repository.interface';
import { ServiceNotFoundError } from '@/domain/errors/service-not-found.error';

class UseCase {
  constructor(private readonly unit_service_repository: IUnitServiceRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const unit_service = await this.unit_service_repository.find_by_unit_and_service(
      input.unit_id,
      input.service_id
    );

    if (!unit_service) {
      throw new ServiceNotFoundError(
        `Unit service not found for unit '${input.unit_id}' and service '${input.service_id}'`
      );
    }

    if (input.custom_price_cents !== undefined) {
      unit_service.update_custom_price(input.custom_price_cents);
    }

    if (input.custom_duration_minutes !== undefined) {
      unit_service.update_custom_duration(input.custom_duration_minutes);
    }

    if (input.is_active !== undefined) {
      if (input.is_active) {
        unit_service.activate();
      } else {
        unit_service.deactivate();
      }
    }

    return this.unit_service_repository.update(unit_service);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    service_id: string;
    custom_price_cents?: number | null;
    custom_duration_minutes?: number | null;
    is_active?: boolean;
  };

  export type Output = Promise<UnitServiceEntity>;
}

export { UseCase as UpdateUnitServiceConfigUseCase };
