import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GetScheduleRulesByUserUseCase } from './get-schedule-rules-by-user.usecase';
import { InMemoryScheduleRuleRepository } from '@/infra/repositories/in-memory/in-memory-schedule-rule.repository';
import { ScheduleRuleEntity } from '@/domain/entities/schedule-rule.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('GetScheduleRulesByUserUseCase', () => {
  let sut: GetScheduleRulesByUserUseCase;
  let schedule_rule_repository: InMemoryScheduleRuleRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    schedule_rule_repository = new InMemoryScheduleRuleRepository();
    sut = new GetScheduleRulesByUserUseCase(schedule_rule_repository);
  });

  it('should get schedule rules by user', async () => {
    const rule = new ScheduleRuleEntity({
      user_id: 'user-1',
      weekday: [1],
      start_time: '09:00',
      end_time: '17:00',
      slot_duration_minutes: 30,
    });
    await schedule_rule_repository.create(rule);

    const input = {
      user_id: 'user-1',
    };

    const rules = await sut.execute(input);

    expect(rules).toHaveLength(1);
    expect(rules[0].user_id).toBe('user-1');
  });

  it('should get schedule rules by user and weekday', async () => {
    const rule1 = new ScheduleRuleEntity({
      user_id: 'user-1',
      weekday: [1, 2],
      start_time: '09:00',
      end_time: '17:00',
      slot_duration_minutes: 30,
    });
    const rule2 = new ScheduleRuleEntity({
      user_id: 'user-1',
      weekday: [3],
      start_time: '10:00',
      end_time: '16:00',
      slot_duration_minutes: 60,
    });

    await schedule_rule_repository.create(rule1);
    await schedule_rule_repository.create(rule2);

    const input = {
      user_id: 'user-1',
      weekday: 1, // Monday
    };

    const rules = await sut.execute(input);

    expect(rules).toHaveLength(1);
    expect(rules[0].weekday).toContain(1);
  });
});
