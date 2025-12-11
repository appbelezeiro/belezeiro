import { UnitAvailabilityRuleEntity } from '@/domain/entities/units/unit-availability-rule.entity';

export interface UnitAvailabilityRulePersistence {
  id: string;
  unit_id: string;
  type: 'weekly' | 'specific_date';
  weekday?: number;
  date?: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
  metadata?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export class UnitAvailabilityRuleDataMapper {
  static toDomain(raw: UnitAvailabilityRulePersistence): UnitAvailabilityRuleEntity {
    return new UnitAvailabilityRuleEntity({
      id: raw.id,
      unit_id: raw.unit_id,
      type: raw.type,
      weekday: raw.weekday,
      date: raw.date,
      start_time: raw.start_time,
      end_time: raw.end_time,
      slot_duration_minutes: raw.slot_duration_minutes,
      is_active: raw.is_active,
      metadata: raw.metadata,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: UnitAvailabilityRuleEntity): UnitAvailabilityRulePersistence {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      type: entity.type,
      weekday: entity.weekday,
      date: entity.date,
      start_time: entity.start_time,
      end_time: entity.end_time,
      slot_duration_minutes: entity.slot_duration_minutes,
      is_active: entity.is_active,
      metadata: entity.metadata,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
