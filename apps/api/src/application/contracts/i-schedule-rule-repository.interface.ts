import { ScheduleRuleEntity } from '@/domain/entities/schedule-rule.entity';

export interface IScheduleRuleRepository {
  create(rule: ScheduleRuleEntity): Promise<ScheduleRuleEntity>;
  find_by_id(id: string): Promise<ScheduleRuleEntity | null>;
  list_by_user(user_id: string): Promise<ScheduleRuleEntity[]>;
  list_by_user_and_weekday(user_id: string, weekday: number): Promise<ScheduleRuleEntity[]>;
  update(rule: ScheduleRuleEntity): Promise<ScheduleRuleEntity>;
  delete(id: string): Promise<boolean>;
}
