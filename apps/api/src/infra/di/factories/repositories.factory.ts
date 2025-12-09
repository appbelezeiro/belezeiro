import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user.repository';
import { InMemoryScheduleRuleRepository } from '@/infra/repositories/in-memory/in-memory-schedule-rule.repository';
import { InMemoryScheduleExceptionRepository } from '@/infra/repositories/in-memory/in-memory-schedule-exception.repository';
import { InMemoryScheduleRepository } from '@/infra/repositories/in-memory/in-memory-schedule.repository';
import type { Clients } from './clients.factory';

export function createRepositories(_clients: Clients) {
  const user_repository = new InMemoryUserRepository();
  const schedule_rule_repository = new InMemoryScheduleRuleRepository();
  const schedule_exception_repository = new InMemoryScheduleExceptionRepository();
  const schedule_repository = new InMemoryScheduleRepository();

  return {
    user_repository,
    schedule_rule_repository,
    schedule_exception_repository,
    schedule_repository,
  };
}

export type Repositories = ReturnType<typeof createRepositories>;
