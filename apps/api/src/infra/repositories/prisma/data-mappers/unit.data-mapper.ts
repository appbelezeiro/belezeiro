import { Unit as PrismaUnit, ServiceType } from '@prisma/client';
import {
  UnitEntity,
  Address,
  EspecialidadeRef,
  ServiceRef,
  Subscription,
  WorkingHours,
  LunchBreak,
} from '@/domain/entities/units/unit.entity.js';
import type { AmenityId } from '@/domain/constants/amenities.js';

type PrismaUnitWithJsonTypes = PrismaUnit & {
  address: Address;
  especialidades: EspecialidadeRef[];
  services: ServiceRef[];
  subscription: Subscription | null;
  working_hours: WorkingHours | null;
  lunch_break: LunchBreak | null;
};

export class UnitDataMapper {
  static toDomain(raw: PrismaUnit): UnitEntity {
    const data = raw as PrismaUnitWithJsonTypes;

    return new UnitEntity({
      id: raw.id,
      organizationId: raw.organization_id,
      name: raw.name,
      brandColor: raw.brand_color,
      logo: raw.logo ?? undefined,
      gallery: raw.gallery,
      isActive: raw.is_active,
      whatsapp: raw.whatsapp,
      phone: raw.phone ?? undefined,
      address: data.address,
      especialidades: data.especialidades,
      services: data.services,
      serviceType: raw.service_type as 'local' | 'home' | 'both',
      amenities: raw.amenities as AmenityId[],
      subscription: data.subscription ?? undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: UnitEntity): Omit<PrismaUnit, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      organization_id: entity.organizationId,
      name: entity.name,
      brand_color: entity.brandColor,
      logo: entity.logo ?? null,
      gallery: entity.gallery,
      is_active: entity.isActive,
      whatsapp: entity.whatsapp,
      phone: entity.phone ?? null,
      address: entity.address as unknown as PrismaUnit['address'],
      especialidades: entity.especialidades as unknown as PrismaUnit['especialidades'],
      services: entity.services as unknown as PrismaUnit['services'],
      service_type: entity.serviceType as ServiceType,
      amenities: entity.amenities,
      subscription: (entity.subscription ?? null) as unknown as PrismaUnit['subscription'],
      working_hours: (entity.workingHours ?? null) as unknown as PrismaUnit['working_hours'],
      lunch_break: (entity.lunchBreak ?? null) as unknown as PrismaUnit['lunch_break'],
    };
  }

  static toPrismaCreate(entity: UnitEntity): Omit<PrismaUnit, 'updated_at'> {
    return {
      ...UnitDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    };
  }
}
