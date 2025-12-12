import { UnitEntity } from '@/domain/entities/units/unit.entity';
import { UnitServiceType } from '@/domain/entities/units/unit.entity.types';
import { SpecialtyEntity } from '@/domain/entities/specialty.entity';
import { ServiceEntity } from '@/domain/entities/service.entity';
import { AmenityEntity } from '@/domain/entities/amenity.entity';
import { AddressProps } from '@/domain/value-objects/address.value-object';
import { PhoneProps } from '@/domain/value-objects/phone.value-object';

type UnitPreferences = {
  palletColor?: string;
};

export interface UnitPersistence {
  id: string;
  orgId: string;
  name: string;
  logo: string;
  gallery: string[];
  active: boolean;
  phones: PhoneProps[];
  address: AddressProps | undefined;
  preferences: Partial<UnitPreferences>;
  serviceType: UnitServiceType;
  especialidades: SpecialtyEntity[];
  services: ServiceEntity[];
  amenities: AmenityEntity[];
  created_at: Date;
  updated_at: Date;
}

export class UnitDataMapper {
  static toDomain(raw: UnitPersistence): UnitEntity {
    return new UnitEntity({
      id: raw.id,
      orgId: raw.orgId,
      name: raw.name,
      logo: raw.logo,
      gallery: raw.gallery,
      active: raw.active,
      phones: raw.phones,
      address: raw.address,
      preferences: raw.preferences,
      serviceType: raw.serviceType,
      especialidades: raw.especialidades,
      services: raw.services,
      amenities: raw.amenities,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: UnitEntity): UnitPersistence {
    return {
      id: entity.id,
      orgId: entity.orgId,
      name: entity.name,
      logo: entity.logo?.URL ?? '',
      gallery: entity.gallery.map((g) => g.URL),
      active: entity.active,
      phones: entity.phones.map((p) => p.toObject()),
      address: entity.address?.toObject(),
      preferences: entity.preferences,
      serviceType: entity.serviceType,
      especialidades: entity.especialidades,
      services: entity.services,
      amenities: entity.amenities,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
