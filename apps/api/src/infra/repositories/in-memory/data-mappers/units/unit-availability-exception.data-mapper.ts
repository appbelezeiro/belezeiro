import { UnitAvailabilityExceptionEntity } from '@/domain/entities/units/unit-availability-exception.entity';

export interface UnitAvailabilityExceptionPersistence {
  id: string;
  unit_id: string;
  date: string;
  type: 'block' | 'override';
  start_time?: string;
  end_time?: string;
  slot_duration_minutes?: number;
  reason?: string;
  created_at: Date;
  updated_at: Date;
}

export class UnitAvailabilityExceptionDataMapper {
  static toDomain(
    raw: UnitAvailabilityExceptionPersistence
  ): UnitAvailabilityExceptionEntity {
    return new UnitAvailabilityExceptionEntity({
      id: raw.id,
      unit_id: raw.unit_id,
      date: raw.date,
      type: raw.type,
      start_time: raw.start_time,
      end_time: raw.end_time,
      slot_duration_minutes: raw.slot_duration_minutes,
      reason: raw.reason,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(
    entity: UnitAvailabilityExceptionEntity
  ): UnitAvailabilityExceptionPersistence {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      date: entity.date,
      type: entity.type,
      start_time: entity.start_time,
      end_time: entity.end_time,
      slot_duration_minutes: entity.slot_duration_minutes,
      reason: entity.reason,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
