import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { UpdateBookingExceptionUseCase } from './update-booking-exception.usecase';
import { InMemoryBookingExceptionRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking-exception.repository';
import { BookingExceptionEntity } from '@/domain/entities/bookings/booking-exception.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { ExceptionNotFoundError } from '@/domain/errors/bookings/exception-not-found.error';
import { InvalidTimeRangeError } from '@/domain/errors/bookings/invalid-time-range.error';

describe('UpdateBookingExceptionUseCase', () => {
  let sut: UpdateBookingExceptionUseCase;
  let booking_exception_repository: InMemoryBookingExceptionRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    booking_exception_repository = new InMemoryBookingExceptionRepository();
    sut = new UpdateBookingExceptionUseCase(booking_exception_repository);
  });

  it('should update exception override times', async () => {
    const exception = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-26',
      type: 'override',
      start_time: '08:00',
      end_time: '12:00',
      slot_duration_minutes: 30,
    });

    await booking_exception_repository.create(exception);

    const input = {
      id: exception.id,
      start_time: '09:00',
      end_time: '13:00',
      slot_duration_minutes: 60,
    };

    const result = await sut.execute(input);

    expect(result.start_time).toBe('09:00');
    expect(result.end_time).toBe('13:00');
    expect(result.slot_duration_minutes).toBe(60);
  });

  it('should update exception reason', async () => {
    const exception = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-25',
      type: 'block',
      reason: 'Holiday',
    });

    await booking_exception_repository.create(exception);

    const input = {
      id: exception.id,
      reason: 'Christmas Day',
    };

    const result = await sut.execute(input);

    expect(result.reason).toBe('Christmas Day');
  });

  it('should throw ExceptionNotFoundError when exception does not exist', async () => {
    const input = {
      id: 'non_existent_id',
      reason: 'New reason',
    };

    await expect(sut.execute(input)).rejects.toThrow(ExceptionNotFoundError);
  });

  it('should throw InvalidTimeRangeError when start_time is after end_time', async () => {
    const exception = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-26',
      type: 'override',
      start_time: '08:00',
      end_time: '12:00',
      slot_duration_minutes: 30,
    });

    await booking_exception_repository.create(exception);

    const input = {
      id: exception.id,
      start_time: '13:00',
      end_time: '09:00',
      slot_duration_minutes: 30,
    };

    await expect(sut.execute(input)).rejects.toThrow(InvalidTimeRangeError);
  });

  it('should throw InvalidTimeRangeError when start_time equals end_time', async () => {
    const exception = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-26',
      type: 'override',
      start_time: '08:00',
      end_time: '12:00',
      slot_duration_minutes: 30,
    });

    await booking_exception_repository.create(exception);

    const input = {
      id: exception.id,
      start_time: '10:00',
      end_time: '10:00',
      slot_duration_minutes: 30,
    };

    await expect(sut.execute(input)).rejects.toThrow(InvalidTimeRangeError);
  });

  it('should update only reason without changing times', async () => {
    const exception = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-26',
      type: 'override',
      start_time: '08:00',
      end_time: '12:00',
      slot_duration_minutes: 30,
    });

    await booking_exception_repository.create(exception);

    const input = {
      id: exception.id,
      reason: 'Updated reason',
    };

    const result = await sut.execute(input);

    expect(result.reason).toBe('Updated reason');
    expect(result.start_time).toBe('08:00');
    expect(result.end_time).toBe('12:00');
  });

  it('should update times without changing reason', async () => {
    const exception = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-26',
      type: 'override',
      start_time: '08:00',
      end_time: '12:00',
      slot_duration_minutes: 30,
      reason: 'Original reason',
    });

    await booking_exception_repository.create(exception);

    const input = {
      id: exception.id,
      start_time: '09:00',
      end_time: '13:00',
      slot_duration_minutes: 45,
    };

    const result = await sut.execute(input);

    expect(result.start_time).toBe('09:00');
    expect(result.end_time).toBe('13:00');
    expect(result.slot_duration_minutes).toBe(45);
    expect(result.reason).toBe('Original reason');
  });

  it('should clear reason when set to undefined', async () => {
    const exception = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-25',
      type: 'block',
      reason: 'Holiday',
    });

    await booking_exception_repository.create(exception);

    const input = {
      id: exception.id,
      reason: undefined,
    };

    const result = await sut.execute(input);

    expect(result.reason).toBeUndefined();
  });
});
