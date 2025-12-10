import { BookingEntity } from '@/domain/entities/booking.entity';
import { IBookingRepository } from '@/application/contracts/i-booking-repository.interface';
import {
  BookingDataMapper,
  BookingPersistence,
} from './data-mappers/booking.data-mapper';

/**
 * In-memory repository with simple mutex lock to prevent race conditions
 * in double-booking scenarios
 */
export class InMemoryBookingRepository implements IBookingRepository {
  private items: BookingPersistence[] = [];
  private locks: Map<string, Promise<void>> = new Map();

  /**
   * Simple lock mechanism to prevent concurrent access
   */
  private async acquire_lock(user_id: string): Promise<() => void> {
    while (this.locks.has(user_id)) {
      await this.locks.get(user_id);
    }

    let release: () => void;
    const lock = new Promise<void>((resolve) => {
      release = resolve;
    });

    this.locks.set(user_id, lock);

    return () => {
      this.locks.delete(user_id);
      release!();
    };
  }

  async create(entity: BookingEntity): Promise<BookingEntity> {
    // Acquire lock for this user to prevent race conditions
    const release = await this.acquire_lock(entity.user_id);

    try {
      const persistence = BookingDataMapper.toPersistence(entity);
      this.items.push(persistence);
      return BookingDataMapper.toDomain(persistence);
    } finally {
      release();
    }
  }

  async update(entity: BookingEntity): Promise<BookingEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`Booking with id ${entity.id} not found`);
    }

    const persistence = BookingDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return BookingDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  async find_by_id(id: string): Promise<BookingEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? BookingDataMapper.toDomain(item) : null;
  }

  async find_by_user_id_and_date_range(
    user_id: string,
    start_date: string,
    end_date: string,
  ): Promise<BookingEntity[]> {
    const start = new Date(start_date);
    const end = new Date(end_date);

    return this.items
      .filter((i) => {
        if (i.user_id !== user_id) return false;

        const booking_start = new Date(i.start_at);
        const booking_end = new Date(i.end_at);

        return booking_start <= end && booking_end >= start;
      })
      .map(BookingDataMapper.toDomain);
  }

  async find_overlapping(
    user_id: string,
    start_at: string,
    end_at: string,
  ): Promise<BookingEntity[]> {
    const start = new Date(start_at);
    const end = new Date(end_at);

    return this.items
      .filter((i) => {
        if (i.user_id !== user_id) return false;

        const booking_start = new Date(i.start_at);
        const booking_end = new Date(i.end_at);

        // Check for overlap: bookingStart < end && bookingEnd > start
        return booking_start < end && booking_end > start;
      })
      .map(BookingDataMapper.toDomain);
  }
}
