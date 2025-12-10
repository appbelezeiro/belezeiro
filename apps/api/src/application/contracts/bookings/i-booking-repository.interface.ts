import { BookingEntity } from '@/domain/entities/bookings/booking.entity';

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
  count_by_user_and_date(user_id: string, date: string): Promise<number>;
  count_by_client_and_user_and_date(
    client_id: string,
    user_id: string,
    date: string,
  ): Promise<number>;
}
