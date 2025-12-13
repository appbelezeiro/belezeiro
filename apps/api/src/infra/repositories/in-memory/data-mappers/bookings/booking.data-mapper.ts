import { BookingEntity } from '@/domain/entities/bookings/booking.entity';

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface BookingPersistence {
  id: string;
  user_id: string;
  client_id: string;
  unit_id: string;
  service_id?: string;
  price_cents?: number;
  notes?: string;
  start_at: string;
  end_at: string;
  status: BookingStatus;
  created_at: Date;
  updated_at: Date;
}

export class BookingDataMapper {
  static toDomain(raw: BookingPersistence): BookingEntity {
    return new BookingEntity({
      id: raw.id,
      user_id: raw.user_id,
      client_id: raw.client_id,
      unit_id: raw.unit_id,
      service_id: raw.service_id,
      price_cents: raw.price_cents,
      notes: raw.notes,
      start_at: raw.start_at,
      end_at: raw.end_at,
      status: raw.status,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: BookingEntity): BookingPersistence {
    return {
      id: entity.id,
      user_id: entity.user_id,
      client_id: entity.client_id,
      unit_id: entity.unit_id,
      service_id: entity.service_id,
      price_cents: entity.price_cents,
      notes: entity.notes,
      start_at: entity.start_at,
      end_at: entity.end_at,
      status: entity.status,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
