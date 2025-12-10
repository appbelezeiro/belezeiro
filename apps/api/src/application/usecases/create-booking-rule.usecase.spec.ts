import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreateBookingRuleUseCase } from './create-booking-rule.usecase';
import { InMemoryBookingRuleRepository } from '@/infra/repositories/in-memory/in-memory-booking-rule.repository';
import { BookingRuleEntity } from '@/domain/entities/booking-rule.entity';
import { InvalidTimeRangeError } from '@/domain/errors/invalid-time-range.error';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('CreateBookingRuleUseCase', () => {
  let sut: CreateBookingRuleUseCase;
  let booking_rule_repository: InMemoryBookingRuleRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    booking_rule_repository = new InMemoryBookingRuleRepository();
    sut = new CreateBookingRuleUseCase(booking_rule_repository);
  });

  it('should create a weekly booking rule', async () => {
    const result = await sut.execute({
      user_id: 'user_1',
      type: 'weekly',
      weekday: 2,
      start_time: '2025-01-14T10:00:00.000Z',
      end_time: '2025-01-14T18:00:00.000Z',
      slot_duration_minutes: 60,
    });

    expect(result).toBeInstanceOf(BookingRuleEntity);
    expect(result.type).toBe('weekly');
    expect(result.weekday).toBe(2);
    expect(result.id).toContain('brl_');
  });

  it('should create a specific_date booking rule', async () => {
    const result = await sut.execute({
      user_id: 'user_1',
      type: 'specific_date',
      date: '2025-12-25',
      start_time: '2025-12-25T14:00:00.000Z',
      end_time: '2025-12-25T17:00:00.000Z',
      slot_duration_minutes: 30,
    });

    expect(result).toBeInstanceOf(BookingRuleEntity);
    expect(result.type).toBe('specific_date');
    expect(result.date).toBe('2025-12-25');
  });

  it('should throw InvalidTimeRangeError if start_time >= end_time', async () => {
    await expect(
      sut.execute({
        user_id: 'user_1',
        type: 'weekly',
        weekday: 2,
        start_time: '2025-01-14T18:00:00.000Z',
        end_time: '2025-01-14T10:00:00.000Z',
        slot_duration_minutes: 60,
      }),
    ).rejects.toThrow(InvalidTimeRangeError);
  });

  it('should throw InvalidTimeRangeError if weekday is missing for weekly rule', async () => {
    await expect(
      sut.execute({
        user_id: 'user_1',
        type: 'weekly',
        start_time: '2025-01-14T10:00:00.000Z',
        end_time: '2025-01-14T18:00:00.000Z',
        slot_duration_minutes: 60,
      }),
    ).rejects.toThrow(InvalidTimeRangeError);
  });

  it('should throw InvalidTimeRangeError if date is missing for specific_date rule', async () => {
    await expect(
      sut.execute({
        user_id: 'user_1',
        type: 'specific_date',
        start_time: '2025-01-14T10:00:00.000Z',
        end_time: '2025-01-14T18:00:00.000Z',
        slot_duration_minutes: 60,
      }),
    ).rejects.toThrow(InvalidTimeRangeError);
  });
});
