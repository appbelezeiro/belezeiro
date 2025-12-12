import { IUnitAvailabilityRuleRepository } from '@/application/contracts/units/i-unit-availability-rule-repository.interface.js';
import { UnitAvailabilityRuleEntity } from '@/domain/entities/units/unit-availability-rule.entity.js';
import { prisma } from '../client/index.js';
import { UnitAvailabilityRuleDataMapper } from '../data-mappers/index.js';

export class PrismaUnitAvailabilityRuleRepository implements IUnitAvailabilityRuleRepository {
  async create(rule: UnitAvailabilityRuleEntity): Promise<UnitAvailabilityRuleEntity> {
    const data = UnitAvailabilityRuleDataMapper.toPrismaCreate(rule);
    const created = await prisma.unitAvailabilityRule.create({ data });
    return UnitAvailabilityRuleDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<UnitAvailabilityRuleEntity | null> {
    const found = await prisma.unitAvailabilityRule.findUnique({ where: { id } });
    return found ? UnitAvailabilityRuleDataMapper.toDomain(found) : null;
  }

  async find_by_unit_id(unit_id: string): Promise<UnitAvailabilityRuleEntity[]> {
    const rules = await prisma.unitAvailabilityRule.findMany({
      where: { unit_id },
      orderBy: { created_at: 'desc' },
    });
    return rules.map(UnitAvailabilityRuleDataMapper.toDomain);
  }

  async find_by_unit_id_and_weekday(
    unit_id: string,
    weekday: number,
  ): Promise<UnitAvailabilityRuleEntity[]> {
    const rules = await prisma.unitAvailabilityRule.findMany({
      where: {
        unit_id,
        type: 'weekly',
        weekday,
        is_active: true,
      },
      orderBy: { created_at: 'desc' },
    });
    return rules.map(UnitAvailabilityRuleDataMapper.toDomain);
  }

  async find_by_unit_id_and_date(
    unit_id: string,
    date: string,
  ): Promise<UnitAvailabilityRuleEntity[]> {
    const rules = await prisma.unitAvailabilityRule.findMany({
      where: {
        unit_id,
        type: 'specific_date',
        date,
        is_active: true,
      },
      orderBy: { created_at: 'desc' },
    });
    return rules.map(UnitAvailabilityRuleDataMapper.toDomain);
  }

  async update(rule: UnitAvailabilityRuleEntity): Promise<UnitAvailabilityRuleEntity> {
    const data = UnitAvailabilityRuleDataMapper.toPrisma(rule);
    const updated = await prisma.unitAvailabilityRule.update({
      where: { id: rule.id },
      data,
    });
    return UnitAvailabilityRuleDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.unitAvailabilityRule.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async delete_all_by_unit_id(unit_id: string): Promise<number> {
    const result = await prisma.unitAvailabilityRule.deleteMany({
      where: { unit_id },
    });
    return result.count;
  }
}
