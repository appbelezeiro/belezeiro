import { IPlanRepository } from '@/application/contracts/billing/i-plan-repository.interface.js';
import { PlanEntity } from '@/domain/entities/billing/plan.entity.js';
import { prisma } from '../client/index.js';
import { PlanDataMapper } from '../data-mappers/index.js';

export class PrismaPlanRepository implements IPlanRepository {
  async create(entity: PlanEntity): Promise<PlanEntity> {
    const data = PlanDataMapper.toPrismaCreate(entity);
    const created = await prisma.plan.create({ data });
    return PlanDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<PlanEntity | null> {
    const found = await prisma.plan.findUnique({ where: { id } });
    return found ? PlanDataMapper.toDomain(found) : null;
  }

  async find_by_name(name: string): Promise<PlanEntity | null> {
    const found = await prisma.plan.findUnique({ where: { name } });
    return found ? PlanDataMapper.toDomain(found) : null;
  }

  async list_active(): Promise<PlanEntity[]> {
    const plans = await prisma.plan.findMany({
      where: { is_active: true },
      orderBy: { price: 'asc' },
    });
    return plans.map(PlanDataMapper.toDomain);
  }

  async list_all(): Promise<PlanEntity[]> {
    const plans = await prisma.plan.findMany({
      orderBy: { created_at: 'desc' },
    });
    return plans.map(PlanDataMapper.toDomain);
  }

  async update(entity: PlanEntity): Promise<PlanEntity> {
    const data = PlanDataMapper.toPrisma(entity);
    const updated = await prisma.plan.update({
      where: { id: entity.id },
      data,
    });
    return PlanDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.plan.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
