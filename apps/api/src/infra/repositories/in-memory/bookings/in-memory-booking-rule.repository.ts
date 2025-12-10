import { BookingRuleEntity } from '@/domain/entities/bookings/booking-rule.entity';
import { IBookingRuleRepository } from '@/application/contracts/bookings/i-booking-rule-repository.interface';
import {
  BookingRuleDataMapper,
  BookingRulePersistence,
} from '../data-mappers/bookings/booking-rule.data-mapper';

export class InMemoryBookingRuleRepository implements IBookingRuleRepository {
  private items: BookingRulePersistence[] = [];

  async create(entity: BookingRuleEntity): Promise<BookingRuleEntity> {
    const persistence = BookingRuleDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return BookingRuleDataMapper.toDomain(persistence);
  }

  async update(entity: BookingRuleEntity): Promise<BookingRuleEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`BookingRule with id ${entity.id} not found`);
    }

    const persistence = BookingRuleDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return BookingRuleDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  async find_by_id(id: string): Promise<BookingRuleEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? BookingRuleDataMapper.toDomain(item) : null;
  }

  async find_by_user_id(user_id: string): Promise<BookingRuleEntity[]> {
    return this.items
      .filter((i) => i.user_id === user_id)
      .map(BookingRuleDataMapper.toDomain);
  }

  async find_by_user_id_and_date(user_id: string, date: string): Promise<BookingRuleEntity[]> {
    return this.items
      .filter((i) => i.user_id === user_id && i.type === 'specific_date' && i.date === date)
      .map(BookingRuleDataMapper.toDomain);
  }

  async find_weekly_by_weekday(user_id: string, weekday: number): Promise<BookingRuleEntity[]> {
    return this.items
      .filter((i) => i.user_id === user_id && i.type === 'weekly' && i.weekday === weekday)
      .map(BookingRuleDataMapper.toDomain);
  }
}
