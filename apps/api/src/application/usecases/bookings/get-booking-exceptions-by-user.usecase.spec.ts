import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GetBookingExceptionsByUserUseCase } from './get-booking-exceptions-by-user.usecase';
import { InMemoryBookingExceptionRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking-exception.repository';
import { BookingExceptionEntity } from '@/domain/entities/bookings/booking-exception.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('GetBookingExceptionsByUserUseCase', () => {
  let sut: GetBookingExceptionsByUserUseCase;
  let booking_exception_repository: InMemoryBookingExceptionRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    booking_exception_repository = new InMemoryBookingExceptionRepository();
    sut = new GetBookingExceptionsByUserUseCase(booking_exception_repository);
  });

  it('should return all exceptions for user', async () => {
    const exception1 = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-25',
      type: 'block',
      reason: 'Christmas',
    });

    const exception2 = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-31',
      type: 'block',
      reason: 'New Year Eve',
    });

    await booking_exception_repository.create(exception1);
    await booking_exception_repository.create(exception2);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(2);
    expect(result[0].user_id).toBe('user_123');
    expect(result[1].user_id).toBe('user_123');
  });

  it('should return exception for specific date', async () => {
    const exception1 = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-25',
      type: 'block',
      reason: 'Christmas',
    });

    const exception2 = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-31',
      type: 'block',
      reason: 'New Year Eve',
    });

    await booking_exception_repository.create(exception1);
    await booking_exception_repository.create(exception2);

    const input = {
      user_id: 'user_123',
      date: '2024-12-25',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2024-12-25');
  });

  it('should return empty array when no exception found for date', async () => {
    const exception = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-25',
      type: 'block',
      reason: 'Christmas',
    });

    await booking_exception_repository.create(exception);

    const input = {
      user_id: 'user_123',
      date: '2024-12-31',
    };

    const result = await sut.execute(input);

    expect(result).toEqual([]);
  });

  it('should return empty array when user has no exceptions', async () => {
    const input = {
      user_id: 'user_without_exceptions',
    };

    const result = await sut.execute(input);

    expect(result).toEqual([]);
  });

  it('should not return exceptions from other users', async () => {
    const exception1 = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-25',
      type: 'block',
      reason: 'Christmas',
    });

    const exception2 = new BookingExceptionEntity({
      user_id: 'user_456',
      date: '2024-12-25',
      type: 'block',
      reason: 'Christmas',
    });

    await booking_exception_repository.create(exception1);
    await booking_exception_repository.create(exception2);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(1);
    expect(result[0].user_id).toBe('user_123');
  });

  it('should return exceptions with all properties', async () => {
    const exception = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-26',
      type: 'override',
      start_time: '08:00',
      end_time: '12:00',
      slot_duration_minutes: 30,
      reason: 'Special hours',
    });

    await booking_exception_repository.create(exception);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result[0].date).toBe('2024-12-26');
    expect(result[0].type).toBe('override');
    expect(result[0].start_time).toBe('08:00');
    expect(result[0].end_time).toBe('12:00');
    expect(result[0].slot_duration_minutes).toBe(30);
    expect(result[0].reason).toBe('Special hours');
  });

  it('should handle both block and override exceptions', async () => {
    const block_exception = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-25',
      type: 'block',
      reason: 'Holiday',
    });

    const override_exception = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-26',
      type: 'override',
      start_time: '08:00',
      end_time: '12:00',
      slot_duration_minutes: 30,
    });

    await booking_exception_repository.create(block_exception);
    await booking_exception_repository.create(override_exception);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(2);
    expect(result.some((e) => e.type === 'block')).toBe(true);
    expect(result.some((e) => e.type === 'override')).toBe(true);
  });
});
