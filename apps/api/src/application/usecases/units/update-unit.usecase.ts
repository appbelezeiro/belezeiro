import { UnitEntity } from '@/domain/entities/units/unit.entity';
import { UnitServiceType } from '@/domain/entities/units/unit.entity.types';
import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface';
import { IAmenityRepository } from '@/application/contracts/i-amenity-repository.interface';
import { ISpecialtyRepository } from '@/application/contracts/i-specialty-repository.interface';
import { IServiceRepository } from '@/application/contracts/i-service-repository.interface';
import { UnitNotFoundError } from '@/domain/errors/units/unit.errors';
import { OneOrMoreAmenitiesNotFound } from '@/domain/errors/amenities/one-or-more-amenities-not-found.error';
import { OneOrMoreSpecialitiesNotFound } from '@/domain/errors/specialities/one-or-more-specialities-not-found.error';
import { OneOrMoreServicesNotFound } from '@/domain/errors/services/one-or-more-services-not-found.error';
import { URLAddressVO } from '@/domain/value-objects/url-address.value-object';
import { PhoneVO, PhoneProps } from '@/domain/value-objects/phone.value-object';
import { AddressVO, AddressProps } from '@/domain/value-objects/address.value-object';

type UnitPreferences = {
  palletColor?: string;
};

class UseCase {
  constructor(
    private readonly unit_repository: IUnitRepository,
    private readonly amenities_repository: IAmenityRepository,
    private readonly specialities_repository: ISpecialtyRepository,
    private readonly services_repository: IServiceRepository,
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const unit = await this.unit_repository.find_by_id(input.id);

    if (!unit) {
      throw new UnitNotFoundError(`Unit with id ${input.id} not found`);
    }

    if (input.name !== undefined) {
      unit.update_name(input.name);
    }

    if (input.preferences !== undefined) {
      unit.update_preferences(input.preferences);
    }

    if (input.logo !== undefined) {
      unit.update_logo(new URLAddressVO(input.logo));
    }

    if (input.gallery !== undefined) {
      const galleryVOs = input.gallery.map((url) => new URLAddressVO(url));
      unit.update_gallery(galleryVOs);
    }

    if (input.active !== undefined) {
      if (input.active) {
        unit.activate();
      } else {
        unit.deactivate();
      }
    }

    if (input.phones !== undefined) {
      const phoneVOs = input.phones.map((phoneProps) => new PhoneVO(phoneProps));
      unit.update_phones(phoneVOs);
    }

    if (input.address !== undefined) {
      unit.update_address(input.address ? new AddressVO(input.address) : undefined);
    }

    if (input.especialidades !== undefined) {
      const specialties = await this.specialities_repository.find_many_by_id(input.especialidades);
      if (specialties.length !== input.especialidades.length) {
        throw new OneOrMoreSpecialitiesNotFound();
      }
      unit.update_especialidades(specialties);
    }

    if (input.services !== undefined) {
      const services = await this.services_repository.find_many_by_id(input.services);
      if (services.length !== input.services.length) {
        throw new OneOrMoreServicesNotFound();
      }
      unit.update_services(services);
    }

    if (input.serviceType !== undefined) {
      unit.update_service_type(input.serviceType);
    }

    if (input.amenities !== undefined) {
      const amenities = await this.amenities_repository.find_many_by_id(input.amenities);
      if (amenities.length !== input.amenities.length) {
        throw new OneOrMoreAmenitiesNotFound();
      }
      unit.update_amenities(amenities);
    }

    return this.unit_repository.update(unit);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
    name?: string;
    preferences?: Partial<UnitPreferences>;
    logo?: string;
    gallery?: string[];
    active?: boolean;
    phones?: PhoneProps[];
    address?: AddressProps | null;
    especialidades?: string[];
    services?: string[];
    serviceType?: UnitServiceType;
    amenities?: string[];
  };

  export type Output = Promise<UnitEntity>;
}

export { UseCase as UpdateUnitUseCase };
