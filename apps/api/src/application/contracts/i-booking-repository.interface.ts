import { BookingEntity } from '@/domain/entities/booking.entity';

export interface IBookingRepository {
  create(entity: BookingEntity): Promise<BookingEntity>;
  update(entity: BookingEntity): Promise<BookingEntity>;
  delete(id: string): Promise<boolean>;
  find_by_id(id: string): Promise<BookingEntity | null>;
  find_by_user_id_and_date_range(
    user_id: string,
    start_date: string,
    end_date: string,
  ): Promise<BookingEntity[]>;
  find_overlapping(user_id: string, start_at: string, end_at: string): Promise<BookingEntity[]>;
}
