import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreateBookingUseCase } from './create-booking.usecase';
import { InMemoryBookingRepository } from '@/infra/repositories/in-memory/in-memory-booking.repository';
import { InMemoryBookingRuleRepository } from '@/infra/repositories/in-memory/in-memory-booking-rule.repository';
import { InMemoryBookingExceptionRepository } from '@/infra/repositories/in-memory/in-memory-booking-exception.repository';
import { BookingEntity } from '@/domain/entities/booking.entity';
import { BookingRuleEntity } from '@/domain/entities/booking-rule.entity';
import { BookingOverlapError } from '@/domain/errors/booking-overlap.error';
import { InvalidTimeRangeError } from '@/domain/errors/invalid-time-range.error';
import { BookingInPastError } from '@/domain/errors/booking-in-past.error';
import { BookingTooCloseError } from '@/domain/errors/booking-too-close.error';
import { BookingExceedsMaxDurationError } from '@/domain/errors/booking-exceeds-max-duration.error';
import { BookingInvalidDurationForSlotError } from '@/domain/errors/booking-invalid-duration-for-slot.error';
import { DailyBookingLimitExceededError } from '@/domain/errors/daily-booking-limit-exceeded.error';
import { ClientDailyBookingLimitExceededError } from '@/domain/errors/client-daily-booking-limit-exceeded.error';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('CreateBookingUseCase', () => {
  let sut: CreateBookingUseCase;
  let booking_repository: InMemoryBookingRepository;
  let booking_rule_repository: InMemoryBookingRuleRepository;
  let booking_exception_repository: InMemoryBookingExceptionRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    booking_repository = new InMemoryBookingRepository();
    booking_rule_repository = new InMemoryBookingRuleRepository();
    booking_exception_repository = new InMemoryBookingExceptionRepository();
    sut = new CreateBookingUseCase(
      booking_repository,
      booking_rule_repository,
      booking_exception_repository,
    );
  });

  it('should create a booking successfully', async () => {
    // Use future date
    const future_date = new Date();
    future_date.setDate(future_date.getDate() + 7); // Next week
    future_date.setHours(10, 0, 0, 0);

    const start_time = future_date.toISOString();
    const end_time = new Date(future_date.getTime() + 3600000).toISOString(); // +1 hour

    // Create a weekly rule for the weekday
    await booking_rule_repository.create(
      new BookingRuleEntity({
        user_id: 'user_1',
        type: 'weekly',
        weekday: future_date.getDay(),
        start_time: start_time,
        end_time: new Date(future_date.getTime() + 8 * 3600000).toISOString(), // +8 hours
        slot_duration_minutes: 60,
      }),
    );

    const result = await sut.execute({
      user_id: 'user_1',
      client_id: 'client_1',
      start_at: start_time,
      end_at: end_time,
    });

    expect(result).toBeInstanceOf(BookingEntity);
    expect(result.user_id).toBe('user_1');
    expect(result.client_id).toBe('client_1');
    expect(result.status).toBe('confirmed');
  });

  it('should throw InvalidTimeRangeError if start_at >= end_at', async () => {
    const future_date = new Date();
    future_date.setDate(future_date.getDate() + 7);

    await expect(
      sut.execute({
        user_id: 'user_1',
        client_id: 'client_1',
        start_at: new Date(future_date.getTime() + 3600000).toISOString(),
        end_at: future_date.toISOString(),
      }),
    ).rejects.toThrow(InvalidTimeRangeError);
  });

  it('should throw InvalidTimeRangeError if booking is in the past', async () => {
    const past_date = new Date();
    past_date.setDate(past_date.getDate() - 1); // Yesterday

    await expect(
      sut.execute({
        user_id: 'user_1',
        client_id: 'client_1',
        start_at: past_date.toISOString(),
        end_at: new Date(past_date.getTime() + 3600000).toISOString(), // +1 hour
      }),
    ).rejects.toThrow(InvalidTimeRangeError);
  });

  it('should throw BookingOverlapError if booking overlaps with existing confirmed booking', async () => {
    // Use future date
    const future_date = new Date();
    future_date.setDate(future_date.getDate() + 7);
    future_date.setHours(10, 0, 0, 0);

    const start_time = future_date.toISOString();
    const end_time = new Date(future_date.getTime() + 3600000).toISOString();

    // Create existing booking
    await booking_repository.create(
      new BookingEntity({
        user_id: 'user_1',
        client_id: 'client_1',
        start_at: start_time,
        end_at: end_time,
      }),
    );

    // Try to create overlapping booking
    await expect(
      sut.execute({
        user_id: 'user_1',
        client_id: 'client_2',
        start_at: new Date(future_date.getTime() + 1800000).toISOString(), // +30 min
        end_at: new Date(future_date.getTime() + 5400000).toISOString(), // +90 min
      }),
    ).rejects.toThrow(BookingOverlapError);
  });

  it('should allow booking if existing booking is cancelled', async () => {
    // Use future date
    const future_date = new Date();
    future_date.setDate(future_date.getDate() + 7);
    future_date.setHours(10, 0, 0, 0);

    const start_time = future_date.toISOString();
    const end_time = new Date(future_date.getTime() + 3600000).toISOString();

    // Create a rule
    await booking_rule_repository.create(
      new BookingRuleEntity({
        user_id: 'user_1',
        type: 'weekly',
        weekday: future_date.getDay(),
        start_time: start_time,
        end_time: new Date(future_date.getTime() + 8 * 3600000).toISOString(),
        slot_duration_minutes: 60,
      }),
    );

    // Create cancelled booking
    const cancelled_booking = new BookingEntity({
      user_id: 'user_1',
      client_id: 'client_1',
      start_at: start_time,
      end_at: end_time,
    });
    cancelled_booking.cancel();
    await booking_repository.create(cancelled_booking);

    // Should allow new booking in same slot
    const result = await sut.execute({
      user_id: 'user_1',
      client_id: 'client_2',
      start_at: start_time,
      end_at: end_time,
    });

    it('should throw InvalidTimeRangeError if start_at >= end_at', async () => {
      await expect(
        sut.execute({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: '2025-12-16T11:00:00.000Z',
          end_at: '2025-12-16T10:00:00.000Z',
        }),
      ).rejects.toThrow(InvalidTimeRangeError);
    });

    it('should throw BookingOverlapError if overlapping', async () => {
      await booking_repository.create(
        new BookingEntity({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: '2025-12-16T10:00:00.000Z',
          end_at: '2025-12-16T11:00:00.000Z',
        }),
      );

      await expect(
        sut.execute({
          user_id: 'user_1',
          client_id: 'client_2',
          start_at: '2025-12-16T10:30:00.000Z',
          end_at: '2025-12-16T11:30:00.000Z',
        }),
      ).rejects.toThrow(BookingOverlapError);
    });
  });

  describe('Booking in past validation', () => {
    it('should throw BookingInPastError when in past', async () => {
      const past = new Date();
      past.setHours(past.getHours() - 2);

      await expect(
        sut.execute({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: past.toISOString(),
          end_at: new Date(past.getTime() + 3600000).toISOString(),
        }),
      ).rejects.toThrow(BookingInPastError);
    });
  });

  describe('Minimum advance time', () => {
    it('should throw BookingTooCloseError when not enough advance', async () => {
      // Use Tuesday 2025-12-16 as reference (far future, known weekday)
      await booking_rule_repository.create(
        new BookingRuleEntity({
          user_id: 'user_1',
          type: 'weekly',
          weekday: 2, // Tuesday
          start_time: '2025-01-14T10:00:00.000Z',
          end_time: '2025-01-14T18:00:00.000Z',
          slot_duration_minutes: 60,
          min_advance_minutes: 43200, // 30 days in minutes
        }),
      );

      // Try to book Tuesday 2025-12-16 (only ~6 days advance from 2025-12-10)
      await expect(
        sut.execute({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: '2025-12-16T10:00:00.000Z',
          end_at: '2025-12-16T11:00:00.000Z',
        }),
      ).rejects.toThrow(BookingTooCloseError);
    });
  });

  describe('Maximum duration', () => {
    it('should throw BookingExceedsMaxDurationError', async () => {
      await booking_rule_repository.create(
        new BookingRuleEntity({
          user_id: 'user_1',
          type: 'weekly',
          weekday: 2,
          start_time: '2025-01-14T10:00:00.000Z',
          end_time: '2025-01-14T18:00:00.000Z',
          slot_duration_minutes: 60,
          max_duration_minutes: 90,
        }),
      );

      await expect(
        sut.execute({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: '2026-01-13T10:00:00.000Z',
          end_at: '2026-01-13T12:00:00.000Z', // 120 minutes
        }),
      ).rejects.toThrow(BookingExceedsMaxDurationError);
    });
  });

  describe('Slot multiple', () => {
    it('should throw BookingInvalidDurationForSlotError', async () => {
      await booking_rule_repository.create(
        new BookingRuleEntity({
          user_id: 'user_1',
          type: 'weekly',
          weekday: 2,
          start_time: '2025-01-14T10:00:00.000Z',
          end_time: '2025-01-14T18:00:00.000Z',
          slot_duration_minutes: 60,
        }),
      );

      await expect(
        sut.execute({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: '2026-01-13T10:00:00.000Z',
          end_at: '2026-01-13T10:45:00.000Z', // 45 minutes
        }),
      ).rejects.toThrow(BookingInvalidDurationForSlotError);
    });
  });

  describe('Daily limit', () => {
    it('should throw DailyBookingLimitExceededError', async () => {
      await booking_rule_repository.create(
        new BookingRuleEntity({
          user_id: 'user_1',
          type: 'weekly',
          weekday: 2,
          start_time: '2025-01-14T08:00:00.000Z',
          end_time: '2025-01-14T18:00:00.000Z',
          slot_duration_minutes: 60,
          max_bookings_per_day: 2,
        }),
      );

      await booking_repository.create(
        new BookingEntity({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: '2026-01-13T08:00:00.000Z',
          end_at: '2026-01-13T09:00:00.000Z',
        }),
      );

      await booking_repository.create(
        new BookingEntity({
          user_id: 'user_1',
          client_id: 'client_2',
          start_at: '2026-01-13T10:00:00.000Z',
          end_at: '2026-01-13T11:00:00.000Z',
        }),
      );

      await expect(
        sut.execute({
          user_id: 'user_1',
          client_id: 'client_3',
          start_at: '2026-01-13T12:00:00.000Z',
          end_at: '2026-01-13T13:00:00.000Z',
        }),
      ).rejects.toThrow(DailyBookingLimitExceededError);
    });
  });

  describe('Client daily limit', () => {
    it('should throw ClientDailyBookingLimitExceededError', async () => {
      await booking_rule_repository.create(
        new BookingRuleEntity({
          user_id: 'user_1',
          type: 'weekly',
          weekday: 2,
          start_time: '2025-01-14T08:00:00.000Z',
          end_time: '2025-01-14T18:00:00.000Z',
          slot_duration_minutes: 60,
          max_bookings_per_client_per_day: 1,
        }),
      );

      await booking_repository.create(
        new BookingEntity({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: '2026-01-13T08:00:00.000Z',
          end_at: '2026-01-13T09:00:00.000Z',
        }),
      );

      await expect(
        sut.execute({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: '2026-01-13T10:00:00.000Z',
          end_at: '2026-01-13T11:00:00.000Z',
        }),
      ).rejects.toThrow(ClientDailyBookingLimitExceededError);
    });
  });
});
