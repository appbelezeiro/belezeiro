import { Booking as PrismaBooking, BookingStatus } from '@prisma/client';
import { BookingEntity } from '@/domain/entities/bookings/booking.entity.js';

export class BookingDataMapper {
  static toDomain(raw: PrismaBooking): BookingEntity {
    return new BookingEntity({
      id: raw.id,
      user_id: raw.user_id,
      client_id: raw.client_id,
      unit_id: raw.unit_id,
      service_id: raw.service_id ?? undefined,
      price_cents: raw.price_cents ?? undefined,
      notes: raw.notes ?? undefined,
      start_at: raw.start_at.toISOString(),
      end_at: raw.end_at.toISOString(),
      status: raw.status as 'confirmed' | 'cancelled' | 'completed' | 'no_show',
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: BookingEntity): Omit<PrismaBooking, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      user_id: entity.user_id,
      client_id: entity.client_id,
      unit_id: entity.unit_id,
      service_id: entity.service_id ?? null,
      price_cents: entity.price_cents ?? null,
      notes: entity.notes ?? null,
      start_at: new Date(entity.start_at),
      end_at: new Date(entity.end_at),
      status: entity.status as BookingStatus,
    };
  }

  static toPrismaCreate(entity: BookingEntity): Omit<PrismaBooking, 'updated_at'> {
    return {
      ...BookingDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    };
  }
}
