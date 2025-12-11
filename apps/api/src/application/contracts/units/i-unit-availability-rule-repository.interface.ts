import { UnitAvailabilityRuleEntity } from '@/domain/entities/units/unit-availability-rule.entity';

export interface IUnitAvailabilityRuleRepository {
  create(rule: UnitAvailabilityRuleEntity): Promise<UnitAvailabilityRuleEntity>;

  find_by_id(id: string): Promise<UnitAvailabilityRuleEntity | null>;

  find_by_unit_id(unit_id: string): Promise<UnitAvailabilityRuleEntity[]>;

  find_by_unit_id_and_weekday(
    unit_id: string,
    weekday: number
  ): Promise<UnitAvailabilityRuleEntity[]>;

  find_by_unit_id_and_date(
    unit_id: string,
    date: string
  ): Promise<UnitAvailabilityRuleEntity[]>;

  update(rule: UnitAvailabilityRuleEntity): Promise<UnitAvailabilityRuleEntity>;

  delete(id: string): Promise<boolean>;

  delete_all_by_unit_id(unit_id: string): Promise<number>;
}
