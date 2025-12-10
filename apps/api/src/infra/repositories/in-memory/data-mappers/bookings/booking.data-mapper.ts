import { BookingEntity } from '@/domain/entities/bookings/booking.entity';

export interface BookingPersistence {
  id: string;
  user_id: string;
  client_id: string;
  start_at: string;
  end_at: string;
  status: 'confirmed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export class BookingDataMapper {
  static toDomain(raw: BookingPersistence): BookingEntity {
    return new BookingEntity({
      id: raw.id,
      user_id: raw.user_id,
      client_id: raw.client_id,
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
      start_at: entity.start_at,
      end_at: entity.end_at,
      status: entity.status,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
