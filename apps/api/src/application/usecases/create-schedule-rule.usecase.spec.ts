import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreateScheduleRuleUseCase } from './create-schedule-rule.usecase';
import { InMemoryScheduleRuleRepository } from '@/infra/repositories/in-memory/in-memory-schedule-rule.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('CreateScheduleRuleUseCase', () => {
  let sut: CreateScheduleRuleUseCase;
  let schedule_rule_repository: InMemoryScheduleRuleRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    schedule_rule_repository = new InMemoryScheduleRuleRepository();
    sut = new CreateScheduleRuleUseCase(schedule_rule_repository);
  });

  it('should create a new schedule rule', async () => {
    const input = {
      user_id: 'user-1',
      weekday: [1, 2, 3], // Monday, Tuesday, Wednesday
      start_time: '09:00',
      end_time: '17:00',
      slot_duration_minutes: 30,
      is_active: true,
    };

    const rule = await sut.execute(input);

    expect(rule.user_id).toBe('user-1');
    expect(rule.weekday).toEqual([1, 2, 3]);
    expect(rule.start_time).toBe('09:00');
    expect(rule.end_time).toBe('17:00');
    expect(rule.slot_duration_minutes).toBe(30);
    expect(rule.is_active).toBe(true);
    expect(rule.id).toContain('srl_');
  });
});
