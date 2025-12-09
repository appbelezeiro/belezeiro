import { ScheduleRuleEntity } from '@/domain/entities/schedule-rule.entity';
import { IScheduleRuleRepository } from '@/application/contracts/i-schedule-rule-repository.interface';
import { ScheduleRuleDataMapper, ScheduleRulePersistence } from './data-mappers/schedule-rule.data-mapper';

export class InMemoryScheduleRuleRepository implements IScheduleRuleRepository {
  private rules: ScheduleRulePersistence[] = [];

  async create(rule: ScheduleRuleEntity): Promise<ScheduleRuleEntity> {
    const persistence = ScheduleRuleDataMapper.toPersistence(rule);

    this.rules.push(persistence);

    return ScheduleRuleDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<ScheduleRuleEntity | null> {
    const rule = this.rules.find((r) => r.id === id);
    return rule ? ScheduleRuleDataMapper.toDomain(rule) : null;
  }

  async list_by_user(user_id: string): Promise<ScheduleRuleEntity[]> {
    return this.rules
      .filter((r) => r.user_id === user_id)
      .map(ScheduleRuleDataMapper.toDomain);
  }

  async list_by_user_and_weekday(user_id: string, weekday: number): Promise<ScheduleRuleEntity[]> {
    return this.rules
      .filter((r) => r.user_id === user_id && r.weekday.includes(weekday))
      .map(ScheduleRuleDataMapper.toDomain);
  }

  async update(rule: ScheduleRuleEntity): Promise<ScheduleRuleEntity> {
    const index = this.rules.findIndex((r) => r.id === rule.id);
    if (index === -1) {
      throw new Error(`ScheduleRule with id ${rule.id} not found`);
    }

    const persistence = ScheduleRuleDataMapper.toPersistence(rule);
    this.rules[index] = persistence;
    return ScheduleRuleDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.rules.findIndex((r) => r.id === id);
    if (index === -1) return false;

    this.rules.splice(index, 1);
    return true;
  }
}
