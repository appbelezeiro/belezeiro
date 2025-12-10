import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { DeleteBookingRuleUseCase } from './delete-booking-rule.usecase';
import { InMemoryBookingRuleRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking-rule.repository';
import { BookingRuleEntity } from '@/domain/entities/bookings/booking-rule.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { RuleNotFoundError } from '@/domain/errors/bookings/rule-not-found.error';

describe('DeleteBookingRuleUseCase', () => {
  let sut: DeleteBookingRuleUseCase;
  let booking_rule_repository: InMemoryBookingRuleRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    booking_rule_repository = new InMemoryBookingRuleRepository();
    sut = new DeleteBookingRuleUseCase(booking_rule_repository);
  });

  it('should delete booking rule', async () => {
    const rule = new BookingRuleEntity({
      user_id: 'user_123',
      weekdays: [1, 2, 3, 4, 5],
      start_time: '09:00',
      end_time: '18:00',
      slot_duration_minutes: 60,
    });

    await booking_rule_repository.create(rule);

    const input = {
      id: rule.id,
    };

    const result = await sut.execute(input);

    expect(result.success).toBe(true);
  });

  it('should throw RuleNotFoundError when rule does not exist', async () => {
    const input = {
      id: 'non_existent_id',
    };

    await expect(sut.execute(input)).rejects.toThrow(RuleNotFoundError);
  });

  it('should remove rule from repository', async () => {
    const rule = new BookingRuleEntity({
      user_id: 'user_123',
      weekdays: [1, 2, 3, 4, 5],
      start_time: '09:00',
      end_time: '18:00',
      slot_duration_minutes: 60,
    });

    await booking_rule_repository.create(rule);

    const input = {
      id: rule.id,
    };

    await sut.execute(input);

    const found = await booking_rule_repository.find_by_id(rule.id);
    expect(found).toBeNull();
  });
});
