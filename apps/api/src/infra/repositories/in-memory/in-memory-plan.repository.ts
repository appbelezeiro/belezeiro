import { PlanEntity } from '@/domain/entities/plan.entity';
import { IPlanRepository } from '@/application/contracts/i-plan-repository.interface';
import { PlanDataMapper, PlanPersistence } from './data-mappers/plan.data-mapper';

export class InMemoryPlanRepository implements IPlanRepository {
  private items: PlanPersistence[] = [];

  async create(entity: PlanEntity): Promise<PlanEntity> {
    const persistence = PlanDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return PlanDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<PlanEntity | null> {
    const item = this.items.find((p) => p.id === id);
    return item ? PlanDataMapper.toDomain(item) : null;
  }

  async find_by_name(name: string): Promise<PlanEntity | null> {
    const item = this.items.find((p) => p.name === name);
    return item ? PlanDataMapper.toDomain(item) : null;
  }

  async list_active(): Promise<PlanEntity[]> {
    return this.items
      .filter((p) => p.is_active)
      .map(PlanDataMapper.toDomain);
  }

  async list_all(): Promise<PlanEntity[]> {
    return this.items.map(PlanDataMapper.toDomain);
  }

  async update(entity: PlanEntity): Promise<PlanEntity> {
    const index = this.items.findIndex((p) => p.id === entity.id);
    if (index === -1) {
      throw new Error(`Plan with id ${entity.id} not found`);
    }

    const persistence = PlanDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return PlanDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
