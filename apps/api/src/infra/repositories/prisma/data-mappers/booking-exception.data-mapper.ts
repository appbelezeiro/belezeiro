import { BookingException as PrismaBookingException, BookingExceptionType } from '@prisma/client';
import { BookingExceptionEntity } from '@/domain/entities/bookings/booking-exception.entity.js';

export class BookingExceptionDataMapper {
  static toDomain(raw: PrismaBookingException): BookingExceptionEntity {
    return new BookingExceptionEntity({
      id: raw.id,
      user_id: raw.user_id,
      date: raw.date,
      type: raw.type as 'block' | 'override',
      start_time: raw.start_time?.toISOString(),
      end_time: raw.end_time?.toISOString(),
      slot_duration_minutes: raw.slot_duration_minutes ?? undefined,
      reason: raw.reason ?? undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: BookingExceptionEntity): Omit<PrismaBookingException, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      user_id: entity.user_id,
      date: entity.date,
      type: entity.type as BookingExceptionType,
      start_time: entity.start_time ? new Date(entity.start_time) : null,
      end_time: entity.end_time ? new Date(entity.end_time) : null,
      slot_duration_minutes: entity.slot_duration_minutes ?? null,
      reason: entity.reason ?? null,
    };
  }

  static toPrismaCreate(entity: BookingExceptionEntity): Omit<PrismaBookingException, 'updated_at'> {
    return {
      ...BookingExceptionDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    };
  }
}
