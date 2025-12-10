import { BookingRuleEntity } from '@/domain/entities/bookings/booking-rule.entity';

export interface IBookingRuleRepository {
  create(entity: BookingRuleEntity): Promise<BookingRuleEntity>;
  update(entity: BookingRuleEntity): Promise<BookingRuleEntity>;
  delete(id: string): Promise<boolean>;
  find_by_id(id: string): Promise<BookingRuleEntity | null>;
  find_by_user_id(user_id: string): Promise<BookingRuleEntity[]>;
  find_by_user_id_and_date(user_id: string, date: string): Promise<BookingRuleEntity[]>;
  find_weekly_by_weekday(user_id: string, weekday: number): Promise<BookingRuleEntity[]>;
}
