import { BookingRule as PrismaBookingRule, BookingRuleType, Prisma } from '@prisma/client';
import { BookingRuleEntity } from '@/domain/entities/bookings/booking-rule.entity.js';

export class BookingRuleDataMapper {
  static toDomain(raw: PrismaBookingRule): BookingRuleEntity {
    return new BookingRuleEntity({
      id: raw.id,
      user_id: raw.user_id,
      type: raw.type as 'weekly' | 'specific_date',
      weekday: raw.weekday ?? undefined,
      date: raw.date ?? undefined,
      start_time: raw.start_time.toISOString(),
      end_time: raw.end_time.toISOString(),
      slot_duration_minutes: raw.slot_duration_minutes,
      min_advance_minutes: raw.min_advance_minutes ?? undefined,
      max_duration_minutes: raw.max_duration_minutes ?? undefined,
      max_bookings_per_day: raw.max_bookings_per_day ?? undefined,
      max_bookings_per_client_per_day: raw.max_bookings_per_client_per_day ?? undefined,
      metadata: raw.metadata as Record<string, unknown> | undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: BookingRuleEntity): Prisma.BookingRuleUncheckedUpdateInput {
    return {
      id: entity.id,
      user_id: entity.user_id,
      type: entity.type as BookingRuleType,
      weekday: entity.weekday ?? null,
      date: entity.date ?? null,
      start_time: new Date(entity.start_time),
      end_time: new Date(entity.end_time),
      slot_duration_minutes: entity.slot_duration_minutes,
      min_advance_minutes: entity.min_advance_minutes ?? null,
      max_duration_minutes: entity.max_duration_minutes ?? null,
      max_bookings_per_day: entity.max_bookings_per_day ?? null,
      max_bookings_per_client_per_day: entity.max_bookings_per_client_per_day ?? null,
      metadata: entity.metadata ? (entity.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
    };
  }

  static toPrismaCreate(entity: BookingRuleEntity): Prisma.BookingRuleUncheckedCreateInput {
    return {
      ...BookingRuleDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    } as Prisma.BookingRuleUncheckedCreateInput;
  }
}
