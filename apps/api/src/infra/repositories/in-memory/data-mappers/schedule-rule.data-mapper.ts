import { ScheduleRuleEntity } from '@/domain/entities/schedule-rule.entity';

export interface ScheduleRulePersistence {
  id: string;
  user_id: string;
  weekday: number[];
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class ScheduleRuleDataMapper {
  static toDomain(raw: ScheduleRulePersistence): ScheduleRuleEntity {
    return new ScheduleRuleEntity({
      id: raw.id,
      user_id: raw.user_id,
      weekday: raw.weekday,
      start_time: raw.start_time,
      end_time: raw.end_time,
      slot_duration_minutes: raw.slot_duration_minutes,
      is_active: raw.is_active,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: ScheduleRuleEntity): ScheduleRulePersistence {
    return {
      id: entity.id,
      user_id: entity.user_id,
      weekday: entity.weekday,
      start_time: entity.start_time,
      end_time: entity.end_time,
      slot_duration_minutes: entity.slot_duration_minutes,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
