import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreateBookingUseCase } from './create-booking.usecase';
import { InMemoryBookingRepository } from '@/infra/repositories/in-memory/in-memory-booking.repository';
import { InMemoryBookingRuleRepository } from '@/infra/repositories/in-memory/in-memory-booking-rule.repository';
import { InMemoryBookingExceptionRepository } from '@/infra/repositories/in-memory/in-memory-booking-exception.repository';
import { BookingEntity } from '@/domain/entities/booking.entity';
import { BookingRuleEntity } from '@/domain/entities/booking-rule.entity';
import { BookingOverlapError } from '@/domain/errors/booking-overlap.error';
import { InvalidTimeRangeError } from '@/domain/errors/invalid-time-range.error';
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
    // Create a weekly rule for Tuesday
    await booking_rule_repository.create(
      new BookingRuleEntity({
        user_id: 'user_1',
        type: 'weekly',
        weekday: 2, // Tuesday
        start_time: '2025-01-14T10:00:00.000Z',
        end_time: '2025-01-14T18:00:00.000Z',
        slot_duration_minutes: 60,
      }),
    );

    const result = await sut.execute({
      user_id: 'user_1',
      client_id: 'client_1',
      start_at: '2025-01-14T10:00:00.000Z',
      end_at: '2025-01-14T11:00:00.000Z',
    });

    expect(result).toBeInstanceOf(BookingEntity);
    expect(result.user_id).toBe('user_1');
    expect(result.client_id).toBe('client_1');
    expect(result.status).toBe('confirmed');
  });

  it('should throw InvalidTimeRangeError if start_at >= end_at', async () => {
    await expect(
      sut.execute({
        user_id: 'user_1',
        client_id: 'client_1',
        start_at: '2025-01-14T11:00:00.000Z',
        end_at: '2025-01-14T10:00:00.000Z',
      }),
    ).rejects.toThrow(InvalidTimeRangeError);
  });

  it('should throw BookingOverlapError if booking overlaps with existing confirmed booking', async () => {
    // Create existing booking
    await booking_repository.create(
      new BookingEntity({
        user_id: 'user_1',
        client_id: 'client_1',
        start_at: '2025-01-14T10:00:00.000Z',
        end_at: '2025-01-14T11:00:00.000Z',
      }),
    );

    // Try to create overlapping booking
    await expect(
      sut.execute({
        user_id: 'user_1',
        client_id: 'client_2',
        start_at: '2025-01-14T10:30:00.000Z',
        end_at: '2025-01-14T11:30:00.000Z',
      }),
    ).rejects.toThrow(BookingOverlapError);
  });

  it('should allow booking if existing booking is cancelled', async () => {
    // Create a rule
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

    // Create cancelled booking
    const cancelled_booking = new BookingEntity({
      user_id: 'user_1',
      client_id: 'client_1',
      start_at: '2025-01-14T10:00:00.000Z',
      end_at: '2025-01-14T11:00:00.000Z',
    });
    cancelled_booking.cancel();
    await booking_repository.create(cancelled_booking);

    // Should allow new booking in same slot
    const result = await sut.execute({
      user_id: 'user_1',
      client_id: 'client_2',
      start_at: '2025-01-14T10:00:00.000Z',
      end_at: '2025-01-14T11:00:00.000Z',
    });

    expect(result.status).toBe('confirmed');
  });
});
