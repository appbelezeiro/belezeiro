import { ScheduleRuleEntity } from '@/domain/entities/schedule-rule.entity';
import { IScheduleRuleRepository } from '@/application/contracts/i-schedule-rule-repository.interface';

class UseCase {
  constructor(private readonly schedule_rule_repository: IScheduleRuleRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const rule = new ScheduleRuleEntity({
      user_id: input.user_id,
      weekday: input.weekday,
      start_time: input.start_time,
      end_time: input.end_time,
      slot_duration_minutes: input.slot_duration_minutes,
      is_active: input.is_active,
    });

    return this.schedule_rule_repository.create(rule);
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    weekday: number[];
    start_time: string;
    end_time: string;
    slot_duration_minutes: number;
    is_active?: boolean;
  };

  export type Output = Promise<ScheduleRuleEntity>;
}

export { UseCase as CreateScheduleRuleUseCase };
