import { UnitEntity } from '@/domain/entities/units/unit.entity';
import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface';
import { IAmenityRepository } from '@/application/contracts/i-amenity-repository.interface';
import { OneOrMoreAmenitiesNotFound } from '@/domain/errors/amenities/one-or-more-amenities-not-found.error';
import { ISpecialtyRepository } from '@/application/contracts/i-specialty-repository.interface';
import { UnitServiceType } from '@/domain/entities/units/unit.entity.types';
import { OneOrMoreSpecialitiesNotFound } from '@/domain/errors/specialities/one-or-more-specialities-not-found.error';
import { IServiceRepository } from '@/application/contracts/i-service-repository.interface';
import { OneOrMoreServicesNotFound } from '@/domain/errors/services/one-or-more-services-not-found.error';
import { AddressProps } from '@/domain/value-objects/address.value-object';
import { PhoneProps } from '@/domain/value-objects/phone.value-object';
import { IOrganizationRepository } from '@/application/contracts/organizations/i-organization-repository.interface';
import { OrganizationNotFoundError } from '@/domain/errors/organizations/organization.errors';

class UseCase {
  constructor(
    private readonly unit_repository: IUnitRepository,
    private readonly organization_repository: IOrganizationRepository,
    private readonly amenities_repository: IAmenityRepository,
    private readonly specialities_repository: ISpecialtyRepository,
    private readonly services_repository: IServiceRepository,
  ) { }

  async execute(input: UseCase.Input): UseCase.Output {
    const amenities = await this.amenities_repository.find_many_by_id(input.amenities);

    if (amenities.length !== input.amenities.length) {
      throw new OneOrMoreAmenitiesNotFound();
    }

    const specialities = await this.specialities_repository.find_many_by_id(input.specalities);

    if (specialities.length !== input.specalities.length) {
      throw new OneOrMoreSpecialitiesNotFound();
    }

    const services = await this.services_repository.find_many_by_id(input.services);

    if (services.length !== input.services.length) {
      throw new OneOrMoreServicesNotFound();
    }

    const organization = await this.organization_repository.find_by_id(input.orgId);

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    const unit = new UnitEntity({
      orgId: input.orgId,
      name: input.name,
      address: input.address,
      logo: input.logo,
      gallery: input.gallery,
      phones: input.phones,
      preferences: input.preferences,
      serviceType: input.serviceType,
      especialidades: specialities,
      services: services,
      amenities: amenities,
    });

    await this.unit_repository.create(unit);

    return unit;
  }
}

declare namespace UseCase {
  export type Input = {
    orgId: string;
    name: string;
    logo: string;
    gallery: string[];
    phones: PhoneProps[];
    address?: AddressProps;
    preferences: Record<string, unknown>;
    specalities: string[];
    services: string[];
    serviceType: UnitServiceType;
    amenities: string[];
  };

  export type Output = Promise<UnitEntity>;
}

export { UseCase as CreateUnitUseCase };
