import { BookingExceptionEntity } from '@/domain/entities/bookings/booking-exception.entity';
import { IBookingExceptionRepository } from '@/application/contracts/bookings/i-booking-exception-repository.interface';
import {
  BookingExceptionDataMapper,
  BookingExceptionPersistence,
} from '../data-mappers/bookings/booking-exception.data-mapper';

export class InMemoryBookingExceptionRepository implements IBookingExceptionRepository {
  private items: BookingExceptionPersistence[] = [];

  async create(entity: BookingExceptionEntity): Promise<BookingExceptionEntity> {
    const persistence = BookingExceptionDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return BookingExceptionDataMapper.toDomain(persistence);
  }

  async update(entity: BookingExceptionEntity): Promise<BookingExceptionEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`BookingException with id ${entity.id} not found`);
    }

    const persistence = BookingExceptionDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return BookingExceptionDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  async find_by_id(id: string): Promise<BookingExceptionEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? BookingExceptionDataMapper.toDomain(item) : null;
  }

  async find_by_user_id(user_id: string): Promise<BookingExceptionEntity[]> {
    return this.items
      .filter((i) => i.user_id === user_id)
      .map(BookingExceptionDataMapper.toDomain);
  }

  async find_by_user_id_and_date(
    user_id: string,
    date: string,
  ): Promise<BookingExceptionEntity | null> {
    const item = this.items.find((i) => i.user_id === user_id && i.date === date);
    return item ? BookingExceptionDataMapper.toDomain(item) : null;
  }
}
