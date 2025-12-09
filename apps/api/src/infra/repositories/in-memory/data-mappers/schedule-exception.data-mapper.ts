import { ScheduleExceptionEntity, ScheduleExceptionType } from '@/domain/entities/schedule-exception.entity';

export interface ScheduleExceptionPersistence {
  id: string;
  user_id: string;
  date: Date;
  type: ScheduleExceptionType;
  start_time?: string;
  end_time?: string;
  reason?: string;
  created_at: Date;
  updated_at: Date;
}

export class ScheduleExceptionDataMapper {
  static toDomain(raw: ScheduleExceptionPersistence): ScheduleExceptionEntity {
    return new ScheduleExceptionEntity({
      id: raw.id,
      user_id: raw.user_id,
      date: raw.date,
      type: raw.type,
      start_time: raw.start_time,
      end_time: raw.end_time,
      reason: raw.reason,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: ScheduleExceptionEntity): ScheduleExceptionPersistence {
    return {
      id: entity.id,
      user_id: entity.user_id,
      date: entity.date,
      type: entity.type,
      start_time: entity.start_time,
      end_time: entity.end_time,
      reason: entity.reason,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
