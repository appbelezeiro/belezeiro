import { PlanEntity } from '@/domain/entities/plan.entity';

export interface IPlanRepository {
  create(entity: PlanEntity): Promise<PlanEntity>;
  find_by_id(id: string): Promise<PlanEntity | null>;
  find_by_name(name: string): Promise<PlanEntity | null>;
  list_active(): Promise<PlanEntity[]>;
  list_all(): Promise<PlanEntity[]>;
  update(entity: PlanEntity): Promise<PlanEntity>;
  delete(id: string): Promise<boolean>;
}
