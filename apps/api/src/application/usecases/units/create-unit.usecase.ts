import { UnitEntity } from '@/domain/entities/units/unit.entity';
import type {
  Address,
  EspecialidadeRef,
  ServiceRef,
  ServiceType,
  Subscription,
} from '@/domain/entities/units/unit.entity';
import type { AmenityId } from '@/domain/constants/amenities';
import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface';
import { BulkCreateUnitAvailabilityRulesUseCase } from './availability/bulk-create-unit-availability-rules.usecase';
import { BulkCreateUnitAvailabilityExceptionsUseCase } from './availability/bulk-create-unit-availability-exceptions.usecase';

class UseCase {
  constructor(
    private readonly unit_repository: IUnitRepository,
    private readonly bulk_create_availability_rules?: BulkCreateUnitAvailabilityRulesUseCase,
    private readonly bulk_create_availability_exceptions?: BulkCreateUnitAvailabilityExceptionsUseCase
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const unit = new UnitEntity({
      organizationId: input.organizationId,
      name: input.name,
      brandColor: input.brandColor,
      subscription: input.subscription,
      logo: input.logo,
      gallery: input.gallery,
      whatsapp: input.whatsapp,
      phone: input.phone,
      address: input.address,
      especialidades: input.especialidades,
      services: input.services,
      serviceType: input.serviceType,
      amenities: input.amenities,
    });

    const created_unit = await this.unit_repository.create(unit);

    // If availability_rules were provided, create them in batch
    if (
      input.availability_rules &&
      input.availability_rules.length > 0 &&
      this.bulk_create_availability_rules
    ) {
      await this.bulk_create_availability_rules.execute({
        unit_id: created_unit.id,
        rules: input.availability_rules,
      });
    }

    // If availability_exceptions were provided, create them in batch
    if (
      input.availability_exceptions &&
      input.availability_exceptions.length > 0 &&
      this.bulk_create_availability_exceptions
    ) {
      await this.bulk_create_availability_exceptions.execute({
        unit_id: created_unit.id,
        exceptions: input.availability_exceptions,
      });
    }

    return created_unit;
  }
}

declare namespace UseCase {
  export type AvailabilityRuleInput = {
    type: 'weekly' | 'specific_date';
    weekday?: number;
    date?: string;
    start_time: string;
    end_time: string;
    slot_duration_minutes: number;
    is_active?: boolean;
    metadata?: Record<string, unknown>;
  };

  export type AvailabilityExceptionInput = {
    date: string;
    type: 'block' | 'override';
    start_time?: string;
    end_time?: string;
    slot_duration_minutes?: number;
    reason?: string;
  };

  export type Input = {
    organizationId: string;
    name: string;
    brandColor: string;
    subscription?: Subscription;
    logo?: string;
    gallery?: string[];
    whatsapp: string;
    phone?: string;
    address: Address;
    especialidades: EspecialidadeRef[];
    services: ServiceRef[];
    serviceType: ServiceType;
    amenities: AmenityId[];

    // Availability rules are now the primary way to define availability
    availability_rules?: AvailabilityRuleInput[];
    availability_exceptions?: AvailabilityExceptionInput[];
  };

  export type Output = Promise<UnitEntity>;
}

export { UseCase as CreateUnitUseCase };
