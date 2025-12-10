import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreateBookingExceptionUseCase } from './create-booking-exception.usecase';
import { InMemoryBookingExceptionRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking-exception.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { InvalidTimeRangeError } from '@/domain/errors/bookings/invalid-time-range.error';

describe('CreateBookingExceptionUseCase', () => {
  let sut: CreateBookingExceptionUseCase;
  let booking_exception_repository: InMemoryBookingExceptionRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    booking_exception_repository = new InMemoryBookingExceptionRepository();
    sut = new CreateBookingExceptionUseCase(booking_exception_repository);
  });

  it('should create block exception', async () => {
    const input = {
      user_id: 'user_123',
      date: '2024-12-25',
      type: 'block' as const,
      reason: 'Christmas holiday',
    };

    const result = await sut.execute(input);

    expect(result.user_id).toBe('user_123');
    expect(result.date).toBe('2024-12-25');
    expect(result.type).toBe('block');
    expect(result.reason).toBe('Christmas holiday');
    expect(result.id).toContain('bex_');
  });

  it('should create override exception with times', async () => {
    const input = {
      user_id: 'user_123',
      date: '2024-12-26',
      type: 'override' as const,
      start_time: '08:00',
      end_time: '12:00',
      slot_duration_minutes: 30,
      reason: 'Special hours',
    };

    const result = await sut.execute(input);

    expect(result.type).toBe('override');
    expect(result.start_time).toBe('08:00');
    expect(result.end_time).toBe('12:00');
    expect(result.slot_duration_minutes).toBe(30);
  });

  it('should throw InvalidTimeRangeError when override missing required fields', async () => {
    const input = {
      user_id: 'user_123',
      date: '2024-12-26',
      type: 'override' as const,
      // Missing start_time, end_time, slot_duration_minutes
    };

    await expect(sut.execute(input)).rejects.toThrow(InvalidTimeRangeError);
  });

  it('should throw InvalidTimeRangeError when start_time is after end_time', async () => {
    const input = {
      user_id: 'user_123',
      date: '2024-12-26',
      type: 'override' as const,
      start_time: '12:00',
      end_time: '08:00',
      slot_duration_minutes: 30,
    };

    await expect(sut.execute(input)).rejects.toThrow(InvalidTimeRangeError);
  });

  it('should throw InvalidTimeRangeError when start_time equals end_time', async () => {
    const input = {
      user_id: 'user_123',
      date: '2024-12-26',
      type: 'override' as const,
      start_time: '10:00',
      end_time: '10:00',
      slot_duration_minutes: 30,
    };

    await expect(sut.execute(input)).rejects.toThrow(InvalidTimeRangeError);
  });

  it('should create exception without reason', async () => {
    const input = {
      user_id: 'user_123',
      date: '2024-12-27',
      type: 'block' as const,
    };

    const result = await sut.execute(input);

    expect(result.reason).toBeUndefined();
  });

  it('should validate ISO date format', async () => {
    const input = {
      user_id: 'user_123',
      date: '2024-12-31',
      type: 'block' as const,
      reason: 'New Year Eve',
    };

    const result = await sut.execute(input);

    expect(result.date).toBe('2024-12-31');
  });
});
