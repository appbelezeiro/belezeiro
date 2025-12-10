import { BookingExceptionEntity } from '@/domain/entities/booking-exception.entity';

export interface IBookingExceptionRepository {
  create(entity: BookingExceptionEntity): Promise<BookingExceptionEntity>;
  update(entity: BookingExceptionEntity): Promise<BookingExceptionEntity>;
  delete(id: string): Promise<boolean>;
  find_by_id(id: string): Promise<BookingExceptionEntity | null>;
  find_by_user_id(user_id: string): Promise<BookingExceptionEntity[]>;
  find_by_user_id_and_date(user_id: string, date: string): Promise<BookingExceptionEntity | null>;
}
