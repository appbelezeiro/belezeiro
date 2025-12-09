import { CreateUserUseCase } from '@/application/usecases/create-user.usecase';
import { CreateScheduleRuleUseCase } from '@/application/usecases/create-schedule-rule.usecase';
import { GetScheduleRulesByUserUseCase } from '@/application/usecases/get-schedule-rules-by-user.usecase';
import { CreateScheduleExceptionUseCase } from '@/application/usecases/create-schedule-exception.usecase';
import { GetScheduleExceptionsByUserUseCase } from '@/application/usecases/get-schedule-exceptions-by-user.usecase';
import { GetSlotsByDayUseCase } from '@/application/usecases/get-slots-by-day.usecase';
import type { Repositories } from './repositories.factory';

export function createUseCases(repositories: Repositories) {
  return {
    // User use cases
    create_user: new CreateUserUseCase(repositories.user_repository),

    // Schedule Rule use cases
    create_schedule_rule: new CreateScheduleRuleUseCase(repositories.schedule_rule_repository),
    get_schedule_rules_by_user: new GetScheduleRulesByUserUseCase(repositories.schedule_rule_repository),

    // Schedule Exception use cases
    create_schedule_exception: new CreateScheduleExceptionUseCase(repositories.schedule_exception_repository),
    get_schedule_exceptions_by_user: new GetScheduleExceptionsByUserUseCase(
      repositories.schedule_exception_repository,
    ),

    // Schedule use cases
    get_slots_by_day: new GetSlotsByDayUseCase(repositories.schedule_repository),
  };
}

export type UseCases = ReturnType<typeof createUseCases>;
