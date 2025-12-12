import { UnitService as PrismaUnitService } from '@prisma/client';
import { UnitServiceEntity } from '@/domain/entities/unit-service.entity.js';

export class UnitServiceDataMapper {
  static toDomain(raw: PrismaUnitService): UnitServiceEntity {
    return new UnitServiceEntity({
      id: raw.id,
      unit_id: raw.unit_id,
      service_id: raw.service_id,
      custom_price_cents: raw.custom_price_cents ?? undefined,
      custom_duration_minutes: raw.custom_duration_minutes ?? undefined,
      is_active: raw.is_active,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: UnitServiceEntity): Omit<PrismaUnitService, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      service_id: entity.service_id,
      custom_price_cents: entity.custom_price_cents ?? null,
      custom_duration_minutes: entity.custom_duration_minutes ?? null,
      is_active: entity.is_active,
    };
  }

  static toPrismaCreate(entity: UnitServiceEntity): Omit<PrismaUnitService, 'updated_at'> {
    return {
      ...UnitServiceDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    };
  }
}
