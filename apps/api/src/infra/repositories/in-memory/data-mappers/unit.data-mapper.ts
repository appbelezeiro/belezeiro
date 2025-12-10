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

export interface UnitPersistence {
  id: string;
  organizationId: string;
  name: string;
  logo?: string;
  gallery: string[];
  isActive: boolean;
  whatsapp: string;
  phone?: string;
  address: Address;
  professions: ProfessionRef[];
  services: ServiceRef[];
  serviceType: ServiceType;
  amenities: AmenityId[];
  workingHours: WorkingHours;
  lunchBreak?: LunchBreak;
  created_at: Date;
  updated_at: Date;
}

export class UnitDataMapper {
  static toDomain(raw: UnitPersistence): UnitEntity {
    return new UnitEntity({
      id: raw.id,
      organizationId: raw.organizationId,
      name: raw.name,
      logo: raw.logo,
      gallery: raw.gallery,
      isActive: raw.isActive,
      whatsapp: raw.whatsapp,
      phone: raw.phone,
      address: raw.address,
      professions: raw.professions,
      services: raw.services,
      serviceType: raw.serviceType,
      amenities: raw.amenities,
      workingHours: raw.workingHours,
      lunchBreak: raw.lunchBreak,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: UnitEntity): UnitPersistence {
    return {
      id: entity.id,
      organizationId: entity.organizationId,
      name: entity.name,
      logo: entity.logo,
      gallery: entity.gallery,
      isActive: entity.isActive,
      whatsapp: entity.whatsapp,
      phone: entity.phone,
      address: entity.address,
      professions: entity.professions,
      services: entity.services,
      serviceType: entity.serviceType,
      amenities: entity.amenities,
      workingHours: entity.workingHours,
      lunchBreak: entity.lunchBreak,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
