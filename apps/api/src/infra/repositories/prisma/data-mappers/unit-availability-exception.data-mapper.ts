import { UnitAvailabilityException as PrismaUnitAvailabilityException, UnitAvailabilityExceptionType } from '@prisma/client';
import { UnitAvailabilityExceptionEntity } from '@/domain/entities/units/unit-availability-exception.entity.js';

export class UnitAvailabilityExceptionDataMapper {
  static toDomain(raw: PrismaUnitAvailabilityException): UnitAvailabilityExceptionEntity {
    return new UnitAvailabilityExceptionEntity({
      id: raw.id,
      unit_id: raw.unit_id,
      date: raw.date,
      type: raw.type as 'block' | 'override',
      start_time: raw.start_time ?? undefined,
      end_time: raw.end_time ?? undefined,
      slot_duration_minutes: raw.slot_duration_minutes ?? undefined,
      reason: raw.reason ?? undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: UnitAvailabilityExceptionEntity): Omit<PrismaUnitAvailabilityException, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      date: entity.date,
      type: entity.type as UnitAvailabilityExceptionType,
      start_time: entity.start_time ?? null,
      end_time: entity.end_time ?? null,
      slot_duration_minutes: entity.slot_duration_minutes ?? null,
      reason: entity.reason ?? null,
    };
  }

  static toPrismaCreate(entity: UnitAvailabilityExceptionEntity): Omit<PrismaUnitAvailabilityException, 'updated_at'> {
    return {
      ...UnitAvailabilityExceptionDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    };
  }
}
