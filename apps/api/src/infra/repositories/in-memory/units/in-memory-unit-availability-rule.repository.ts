import { UnitAvailabilityRuleEntity } from '@/domain/entities/units/unit-availability-rule.entity';
import { IUnitAvailabilityRuleRepository } from '@/application/contracts/units/i-unit-availability-rule-repository.interface';
import {
  UnitAvailabilityRuleDataMapper,
  UnitAvailabilityRulePersistence,
} from '../data-mappers/units/unit-availability-rule.data-mapper';

export class InMemoryUnitAvailabilityRuleRepository
  implements IUnitAvailabilityRuleRepository
{
  private items: UnitAvailabilityRulePersistence[] = [];

  async create(entity: UnitAvailabilityRuleEntity): Promise<UnitAvailabilityRuleEntity> {
    const persistence = UnitAvailabilityRuleDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return UnitAvailabilityRuleDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<UnitAvailabilityRuleEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? UnitAvailabilityRuleDataMapper.toDomain(item) : null;
  }

  async find_by_unit_id(unit_id: string): Promise<UnitAvailabilityRuleEntity[]> {
    return this.items
      .filter((i) => i.unit_id === unit_id)
      .map(UnitAvailabilityRuleDataMapper.toDomain);
  }

  async find_by_unit_id_and_weekday(
    unit_id: string,
    weekday: number
  ): Promise<UnitAvailabilityRuleEntity[]> {
    return this.items
      .filter((i) => i.unit_id === unit_id && i.type === 'weekly' && i.weekday === weekday)
      .map(UnitAvailabilityRuleDataMapper.toDomain);
  }

  async find_by_unit_id_and_date(
    unit_id: string,
    date: string
  ): Promise<UnitAvailabilityRuleEntity[]> {
    return this.items
      .filter(
        (i) => i.unit_id === unit_id && i.type === 'specific_date' && i.date === date
      )
      .map(UnitAvailabilityRuleDataMapper.toDomain);
  }

  async update(entity: UnitAvailabilityRuleEntity): Promise<UnitAvailabilityRuleEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`UnitAvailabilityRule with id ${entity.id} not found`);
    }

    const persistence = UnitAvailabilityRuleDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return UnitAvailabilityRuleDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  async delete_all_by_unit_id(unit_id: string): Promise<number> {
    const initial_length = this.items.length;
    this.items = this.items.filter((i) => i.unit_id !== unit_id);
    return initial_length - this.items.length;
  }
}
