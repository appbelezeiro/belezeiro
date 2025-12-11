import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GetBookingRulesByUserUseCase } from './get-booking-rules-by-user.usecase';
import { InMemoryBookingRuleRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking-rule.repository';
import { BookingRuleEntity } from '@/domain/entities/bookings/booking-rule.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('GetBookingRulesByUserUseCase', () => {
  let sut: GetBookingRulesByUserUseCase;
  let booking_rule_repository: InMemoryBookingRuleRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    booking_rule_repository = new InMemoryBookingRuleRepository();
    sut = new GetBookingRulesByUserUseCase(booking_rule_repository);
  });

  it('should return all rules for user', async () => {
    const rule1 = new BookingRuleEntity({
      user_id: 'user_123',
      type: 'weekly',
      weekday: 1, // Monday
      start_time: '2024-01-01T09:00:00Z',
      end_time: '2024-01-01T18:00:00Z',
      slot_duration_minutes: 60,
    });

    const rule2 = new BookingRuleEntity({
      user_id: 'user_123',
      type: 'weekly',
      weekday: 6, // Saturday
      start_time: '2024-01-01T10:00:00Z',
      end_time: '2024-01-01T14:00:00Z',
      slot_duration_minutes: 30,
    });

    await booking_rule_repository.create(rule1);
    await booking_rule_repository.create(rule2);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(2);
    expect(result[0].user_id).toBe('user_123');
    expect(result[1].user_id).toBe('user_123');
  });

  it('should return empty array when user has no rules', async () => {
    const input = {
      user_id: 'user_without_rules',
    };

    const result = await sut.execute(input);

    expect(result).toEqual([]);
  });

  it('should not return rules from other users', async () => {
    const rule1 = new BookingRuleEntity({
      user_id: 'user_123',
      type: 'weekly',
      weekday: 1,
      start_time: '2024-01-01T09:00:00Z',
      end_time: '2024-01-01T18:00:00Z',
      slot_duration_minutes: 60,
    });

    const rule2 = new BookingRuleEntity({
      user_id: 'user_456',
      type: 'weekly',
      weekday: 1,
      start_time: '2024-01-01T09:00:00Z',
      end_time: '2024-01-01T18:00:00Z',
      slot_duration_minutes: 60,
    });

    await booking_rule_repository.create(rule1);
    await booking_rule_repository.create(rule2);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(1);
    expect(result[0].user_id).toBe('user_123');
  });

  it('should return rules with all properties', async () => {
    const rule = new BookingRuleEntity({
      user_id: 'user_123',
      type: 'weekly',
      weekday: 1, // Monday
      start_time: '2024-01-01T08:00:00Z',
      end_time: '2024-01-01T17:00:00Z',
      slot_duration_minutes: 45,
      metadata: {
        service_type: 'consultation',
      },
    });

    await booking_rule_repository.create(rule);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result[0].type).toBe('weekly');
    expect(result[0].weekday).toBe(1);
    expect(result[0].start_time).toBe('2024-01-01T08:00:00Z');
    expect(result[0].end_time).toBe('2024-01-01T17:00:00Z');
    expect(result[0].slot_duration_minutes).toBe(45);
    expect(result[0].metadata).toEqual({ service_type: 'consultation' });
  });
});
