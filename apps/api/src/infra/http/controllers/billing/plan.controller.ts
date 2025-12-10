import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { PlanMapper } from '@/application/dtos/mappers/billing/plan.mapper';
import { PlanNotFoundError } from '@/domain/errors/billing/plan.errors';
import { NotFoundError } from '../../errors/http-errors';

export class PlanController {
  constructor(private readonly container: Container) {}

  async list_active(c: Context) {
    const plans = await this.container.use_cases.list_active_plans.execute({});

    return c.json(PlanMapper.toListItemList(plans));
  }

  async get_by_id(c: Context) {
    try {
      const { id } = c.req.param();

      const plan = await this.container.use_cases.get_plan_by_id.execute({
        plan_id: id,
      });

      return c.json(PlanMapper.toDTO(plan));
    } catch (error) {
      if (error instanceof PlanNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }
}
