import { UnitAvailabilityRule as PrismaUnitAvailabilityRule, UnitAvailabilityRuleType, Prisma } from '@prisma/client';
import { UnitAvailabilityRuleEntity } from '@/domain/entities/units/unit-availability-rule.entity.js';

export class UnitAvailabilityRuleDataMapper {
  static toDomain(raw: PrismaUnitAvailabilityRule): UnitAvailabilityRuleEntity {
    return new UnitAvailabilityRuleEntity({
      id: raw.id,
      unit_id: raw.unit_id,
      type: raw.type as 'weekly' | 'specific_date',
      weekday: raw.weekday ?? undefined,
      date: raw.date ?? undefined,
      start_time: raw.start_time,
      end_time: raw.end_time,
      slot_duration_minutes: raw.slot_duration_minutes,
      is_active: raw.is_active,
      metadata: raw.metadata as Record<string, unknown> | undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: UnitAvailabilityRuleEntity): Prisma.UnitAvailabilityRuleUncheckedUpdateInput {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      type: entity.type as UnitAvailabilityRuleType,
      weekday: entity.weekday ?? null,
      date: entity.date ?? null,
      start_time: entity.start_time,
      end_time: entity.end_time,
      slot_duration_minutes: entity.slot_duration_minutes,
      is_active: entity.is_active,
      metadata: entity.metadata ? (entity.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
    };
  }

  static toPrismaCreate(entity: UnitAvailabilityRuleEntity): Prisma.UnitAvailabilityRuleUncheckedCreateInput {
    return {
      ...UnitAvailabilityRuleDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    } as Prisma.UnitAvailabilityRuleUncheckedCreateInput;
  }
}
