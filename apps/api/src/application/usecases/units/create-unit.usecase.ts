import { UnitEntity } from '@/domain/entities/units/unit.entity';
import type {
  Address,
  ProfessionRef,
  ServiceRef,
  ServiceType,
  WorkingHours,
  LunchBreak,
} from '@/domain/entities/units/unit.entity';
import type { AmenityId } from '@/domain/constants/amenities';
import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface';

class UseCase {
  constructor(private readonly unit_repository: IUnitRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const unit = new UnitEntity({
      organizationId: input.organizationId,
      name: input.name,
      logo: input.logo,
      gallery: input.gallery,
      whatsapp: input.whatsapp,
      phone: input.phone,
      address: input.address,
      professions: input.professions,
      services: input.services,
      serviceType: input.serviceType,
      amenities: input.amenities,
      workingHours: input.workingHours,
      lunchBreak: input.lunchBreak,
    });

    return this.unit_repository.create(unit);
  }
}

declare namespace UseCase {
  export type Input = {
    organizationId: string;
    name: string;
    logo?: string;
    gallery?: string[];
    whatsapp: string;
    phone?: string;
    address: Address;
    professions: ProfessionRef[];
    services: ServiceRef[];
    serviceType: ServiceType;
    amenities: AmenityId[];
    workingHours: WorkingHours;
    lunchBreak?: LunchBreak;
  };

  export type Output = Promise<UnitEntity>;
}

export { UseCase as CreateUnitUseCase };
