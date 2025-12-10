import { UnitEntity } from '@/domain/entities/unit.entity';
import type {
  Address,
  ProfessionRef,
  ServiceRef,
  ServiceType,
  WorkingHours,
  LunchBreak,
} from '@/domain/entities/unit.entity';
import type { AmenityId } from '@/domain/constants/amenities';
import { IUnitRepository } from '@/application/contracts/i-unit-repository.interface';
import { UnitNotFoundError } from '@/domain/errors/unit.errors';

class UseCase {
  constructor(private readonly unit_repository: IUnitRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const unit = await this.unit_repository.find_by_id(input.id);

    if (!unit) {
      throw new UnitNotFoundError(`Unit with id ${input.id} not found`);
    }

    if (input.name !== undefined) {
      unit.update_name(input.name);
    }

    if (input.logo !== undefined) {
      unit.update_logo(input.logo);
    }

    if (input.gallery !== undefined) {
      unit.update_gallery(input.gallery);
    }

    if (input.isActive !== undefined) {
      if (input.isActive) {
        unit.activate();
      } else {
        unit.deactivate();
      }
    }

    if (input.whatsapp !== undefined || input.phone !== undefined) {
      unit.update_contact(input.whatsapp ?? unit.whatsapp, input.phone);
    }

    if (input.address !== undefined) {
      unit.update_address(input.address);
    }

    if (input.professions !== undefined) {
      unit.update_professions(input.professions);
    }

    if (input.services !== undefined) {
      unit.update_services(input.services);
    }

    if (input.serviceType !== undefined) {
      unit.update_service_type(input.serviceType);
    }

    if (input.amenities !== undefined) {
      unit.update_amenities(input.amenities);
    }

    if (input.workingHours !== undefined) {
      unit.update_working_hours(input.workingHours);
    }

    if (input.lunchBreak !== undefined) {
      unit.update_lunch_break(input.lunchBreak);
    }

    return this.unit_repository.update(unit);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
    name?: string;
    logo?: string;
    gallery?: string[];
    isActive?: boolean;
    whatsapp?: string;
    phone?: string;
    address?: Address;
    professions?: ProfessionRef[];
    services?: ServiceRef[];
    serviceType?: ServiceType;
    amenities?: AmenityId[];
    workingHours?: WorkingHours;
    lunchBreak?: LunchBreak;
  };

  export type Output = Promise<UnitEntity>;
}

export { UseCase as UpdateUnitUseCase };
