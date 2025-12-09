import { ScheduleRuleEntity } from '@/domain/entities/schedule-rule.entity';
import { IScheduleRuleRepository } from '@/application/contracts/i-schedule-rule-repository.interface';

class UseCase {
  constructor(private readonly schedule_rule_repository: IScheduleRuleRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    if (input.weekday !== undefined) {
      return this.schedule_rule_repository.list_by_user_and_weekday(input.user_id, input.weekday);
    }

    return this.schedule_rule_repository.list_by_user(input.user_id);
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    weekday?: number;
  };

  export type Output = Promise<ScheduleRuleEntity[]>;
}

export { UseCase as GetScheduleRulesByUserUseCase };
