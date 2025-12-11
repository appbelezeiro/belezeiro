import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GetAvailableSlotsUseCase } from './get-available-slots.usecase';
import { InMemoryBookingRuleRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking-rule.repository';
import { InMemoryBookingExceptionRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking-exception.repository';
import { InMemoryBookingRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking.repository';
import { BookingRuleEntity } from '@/domain/entities/bookings/booking-rule.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('GetAvailableSlotsUseCase', () => {
  let sut: GetAvailableSlotsUseCase;
  let booking_rule_repository: InMemoryBookingRuleRepository;
  let booking_exception_repository: InMemoryBookingExceptionRepository;
  let booking_repository: InMemoryBookingRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    booking_rule_repository = new InMemoryBookingRuleRepository();
    booking_exception_repository = new InMemoryBookingExceptionRepository();
    booking_repository = new InMemoryBookingRepository();
    sut = new GetAvailableSlotsUseCase(
      booking_rule_repository,
      booking_exception_repository,
      booking_repository,
    );
  });

  it('should return available slots for a date', async () => {
    const rule = new BookingRuleEntity({
      user_id: 'user_123',
      type: 'weekly',
      weekday: 1, // Monday
      start_time: '2024-01-01T09:00:00Z',
      end_time: '2024-01-01T12:00:00Z',
      slot_duration_minutes: 60,
    });

    await booking_rule_repository.create(rule);

    const input = {
      user_id: 'user_123',
      date: '2024-12-16', // Monday
    };

    const result = await sut.execute(input);

    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('slots');
    expect(result.date).toBe('2024-12-16');
    expect(Array.isArray(result.slots)).toBe(true);
  });

  it('should return empty slots when user has no rules', async () => {
    const input = {
      user_id: 'user_without_rules',
      date: '2024-12-16',
    };

    const result = await sut.execute(input);

    expect(result.slots).toEqual([]);
  });

  it('should return date in response', async () => {
    const rule = new BookingRuleEntity({
      user_id: 'user_123',
      type: 'weekly',
      weekday: 1,
      start_time: '2024-01-01T09:00:00Z',
      end_time: '2024-01-01T18:00:00Z',
      slot_duration_minutes: 60,
    });

    await booking_rule_repository.create(rule);

    const input = {
      user_id: 'user_123',
      date: '2024-12-17',
    };

    const result = await sut.execute(input);

    expect(result.date).toBe('2024-12-17');
  });

  it('should handle ISO date format YYYY-MM-DD', async () => {
    const rule = new BookingRuleEntity({
      user_id: 'user_123',
      type: 'weekly',
      weekday: 1,
      start_time: '2024-01-01T09:00:00Z',
      end_time: '2024-01-01T18:00:00Z',
      slot_duration_minutes: 60,
    });

    await booking_rule_repository.create(rule);

    const input = {
      user_id: 'user_123',
      date: '2024-12-20',
    };

    const result = await sut.execute(input);

    expect(result.date).toBe('2024-12-20');
    expect(Array.isArray(result.slots)).toBe(true);
  });
});
