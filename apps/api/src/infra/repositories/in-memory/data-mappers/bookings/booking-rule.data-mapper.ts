import { BookingRuleEntity } from '@/domain/entities/bookings/booking-rule.entity';

export interface BookingRulePersistence {
  id: string;
  user_id: string;
  type: 'weekly' | 'specific_date';
  weekday?: number;
  date?: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  min_advance_minutes?: number;
  max_duration_minutes?: number;
  max_bookings_per_day?: number;
  max_bookings_per_client_per_day?: number;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export class BookingRuleDataMapper {
  static toDomain(raw: BookingRulePersistence): BookingRuleEntity {
    return new BookingRuleEntity({
      id: raw.id,
      user_id: raw.user_id,
      type: raw.type,
      weekday: raw.weekday,
      date: raw.date,
      start_time: raw.start_time,
      end_time: raw.end_time,
      slot_duration_minutes: raw.slot_duration_minutes,
      min_advance_minutes: raw.min_advance_minutes,
      max_duration_minutes: raw.max_duration_minutes,
      max_bookings_per_day: raw.max_bookings_per_day,
      max_bookings_per_client_per_day: raw.max_bookings_per_client_per_day,
      metadata: raw.metadata,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: BookingRuleEntity): BookingRulePersistence {
    return {
      id: entity.id,
      user_id: entity.user_id,
      type: entity.type,
      weekday: entity.weekday,
      date: entity.date,
      start_time: entity.start_time,
      end_time: entity.end_time,
      slot_duration_minutes: entity.slot_duration_minutes,
      min_advance_minutes: entity.min_advance_minutes,
      max_duration_minutes: entity.max_duration_minutes,
      max_bookings_per_day: entity.max_bookings_per_day,
      max_bookings_per_client_per_day: entity.max_bookings_per_client_per_day,
      metadata: entity.metadata ?? {},
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
