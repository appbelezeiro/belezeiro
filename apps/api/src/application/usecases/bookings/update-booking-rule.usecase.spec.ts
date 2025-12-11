import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { UpdateBookingRuleUseCase } from './update-booking-rule.usecase';
import { InMemoryBookingRuleRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking-rule.repository';
import { BookingRuleEntity } from '@/domain/entities/bookings/booking-rule.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { RuleNotFoundError } from '@/domain/errors/bookings/rule-not-found.error';
import { InvalidTimeRangeError } from '@/domain/errors/bookings/invalid-time-range.error';

describe('UpdateBookingRuleUseCase', () => {
  let sut: UpdateBookingRuleUseCase;
  let booking_rule_repository: InMemoryBookingRuleRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    booking_rule_repository = new InMemoryBookingRuleRepository();
    sut = new UpdateBookingRuleUseCase(booking_rule_repository);
  });

  it('should update rule times', async () => {
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
      id: rule.id,
      start_time: '2024-01-01T08:00:00Z',
      end_time: '2024-01-01T17:00:00Z',
    };

    const result = await sut.execute(input);

    expect(result.start_time).toBe('2024-01-01T08:00:00Z');
    expect(result.end_time).toBe('2024-01-01T17:00:00Z');
  });

  it('should update slot duration', async () => {
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
      id: rule.id,
      slot_duration_minutes: 30,
    };

    const result = await sut.execute(input);

    expect(result.slot_duration_minutes).toBe(30);
  });

  it('should update metadata', async () => {
    const rule = new BookingRuleEntity({
      user_id: 'user_123',
      type: 'weekly',
      weekday: 1,
      start_time: '2024-01-01T09:00:00Z',
      end_time: '2024-01-01T18:00:00Z',
      slot_duration_minutes: 60,
      metadata: {
        service_type: 'consultation',
      },
    });

    await booking_rule_repository.create(rule);

    const input = {
      id: rule.id,
      metadata: {
        service_type: 'treatment',
        room: 'A1',
      },
    };

    const result = await sut.execute(input);

    expect(result.metadata).toEqual({
      service_type: 'treatment',
      room: 'A1',
    });
  });

  it('should throw RuleNotFoundError when rule does not exist', async () => {
    const input = {
      id: 'non_existent_id',
      start_time: '2024-01-01T08:00:00Z',
      end_time: '2024-01-01T17:00:00Z',
    };

    await expect(sut.execute(input)).rejects.toThrow(RuleNotFoundError);
  });

  it('should throw InvalidTimeRangeError when start_time is after end_time', async () => {
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
      id: rule.id,
      start_time: '2024-01-01T18:00:00Z',
      end_time: '2024-01-01T09:00:00Z',
    };

    await expect(sut.execute(input)).rejects.toThrow(InvalidTimeRangeError);
  });

  it('should throw InvalidTimeRangeError when start_time equals end_time', async () => {
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
      id: rule.id,
      start_time: '2024-01-01T10:00:00Z',
      end_time: '2024-01-01T10:00:00Z',
    };

    await expect(sut.execute(input)).rejects.toThrow(InvalidTimeRangeError);
  });

  it('should update only times without changing slot duration', async () => {
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
      id: rule.id,
      start_time: '2024-01-01T08:00:00Z',
      end_time: '2024-01-01T17:00:00Z',
    };

    const result = await sut.execute(input);

    expect(result.start_time).toBe('2024-01-01T08:00:00Z');
    expect(result.end_time).toBe('2024-01-01T17:00:00Z');
    expect(result.slot_duration_minutes).toBe(60);
  });

  it('should update only slot duration without changing times', async () => {
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
      id: rule.id,
      slot_duration_minutes: 45,
    };

    const result = await sut.execute(input);

    expect(result.slot_duration_minutes).toBe(45);
    expect(result.start_time).toBe('2024-01-01T09:00:00Z');
    expect(result.end_time).toBe('2024-01-01T18:00:00Z');
  });

  it('should update multiple properties at once', async () => {
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
      id: rule.id,
      start_time: '2024-01-01T08:00:00Z',
      end_time: '2024-01-01T17:00:00Z',
      slot_duration_minutes: 30,
      metadata: {
        updated: true,
      },
    };

    const result = await sut.execute(input);

    expect(result.start_time).toBe('2024-01-01T08:00:00Z');
    expect(result.end_time).toBe('2024-01-01T17:00:00Z');
    expect(result.slot_duration_minutes).toBe(30);
    expect(result.metadata).toEqual({ updated: true });
  });

  it('should preserve weekday when updating', async () => {
    const rule = new BookingRuleEntity({
      user_id: 'user_123',
      type: 'weekly',
      weekday: 1, // Monday
      start_time: '2024-01-01T09:00:00Z',
      end_time: '2024-01-01T18:00:00Z',
      slot_duration_minutes: 60,
    });

    await booking_rule_repository.create(rule);

    const input = {
      id: rule.id,
      start_time: '2024-01-01T08:00:00Z',
      end_time: '2024-01-01T17:00:00Z',
    };

    const result = await sut.execute(input);

    expect(result.type).toBe('weekly');
    expect(result.weekday).toBe(1);
  });
});
