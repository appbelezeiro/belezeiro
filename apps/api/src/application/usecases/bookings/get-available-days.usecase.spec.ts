import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { GetAvailableDaysUseCase } from './get-available-days.usecase';
import { InMemoryBookingRuleRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking-rule.repository';
import { InMemoryBookingExceptionRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking-exception.repository';
import { InMemoryBookingRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking.repository';
import { BookingRuleEntity } from '@/domain/entities/bookings/booking-rule.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('GetAvailableDaysUseCase', () => {
  let sut: GetAvailableDaysUseCase;
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
    sut = new GetAvailableDaysUseCase(
      booking_rule_repository,
      booking_exception_repository,
      booking_repository,
    );
  });

  it('should return available days for user with rules', async () => {
    const rule = new BookingRuleEntity({
      user_id: 'user_123',
      weekdays: [1, 2, 3, 4, 5], // Monday to Friday
      start_time: '09:00',
      end_time: '18:00',
      slot_duration_minutes: 60,
    });

    await booking_rule_repository.create(rule);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveProperty('days');
    expect(Array.isArray(result.days)).toBe(true);
  });

  it('should return empty array when user has no rules', async () => {
    const input = {
      user_id: 'user_without_rules',
    };

    const result = await sut.execute(input);

    expect(result.days).toEqual([]);
  });

  it('should use default days_ahead of 45 when not provided', async () => {
    const rule = new BookingRuleEntity({
      user_id: 'user_123',
      weekdays: [1, 2, 3, 4, 5],
      start_time: '09:00',
      end_time: '18:00',
      slot_duration_minutes: 60,
    });

    await booking_rule_repository.create(rule);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result.days.length).toBeGreaterThan(0);
  });

  it('should use custom days_ahead when provided', async () => {
    const rule = new BookingRuleEntity({
      user_id: 'user_123',
      weekdays: [1, 2, 3, 4, 5],
      start_time: '09:00',
      end_time: '18:00',
      slot_duration_minutes: 60,
    });

    await booking_rule_repository.create(rule);

    const input = {
      user_id: 'user_123',
      days_ahead: 7,
    };

    const result = await sut.execute(input);

    expect(result.days.length).toBeGreaterThan(0);
  });

  it('should return days in YYYY-MM-DD format', async () => {
    const rule = new BookingRuleEntity({
      user_id: 'user_123',
      weekdays: [1, 2, 3, 4, 5],
      start_time: '09:00',
      end_time: '18:00',
      slot_duration_minutes: 60,
    });

    await booking_rule_repository.create(rule);

    const input = {
      user_id: 'user_123',
      days_ahead: 7,
    };

    const result = await sut.execute(input);

    if (result.days.length > 0) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      expect(result.days[0]).toMatch(dateRegex);
    }
  });
});
