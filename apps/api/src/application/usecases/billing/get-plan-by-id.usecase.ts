import { PlanEntity } from '@/domain/entities/billing/plan.entity';
import { IPlanRepository } from '@/application/contracts/billing/i-plan-repository.interface';
import { PlanNotFoundError } from '@/domain/errors/billing/plan.errors';

class UseCase {
  constructor(private readonly plan_repository: IPlanRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const plan = await this.plan_repository.find_by_id(input.plan_id);

    if (!plan) {
      throw new PlanNotFoundError(`Plan with ID ${input.plan_id} not found`);
    }

    return plan;
  }
}

declare namespace UseCase {
  export type Input = {
    plan_id: string;
  };

  export type Output = Promise<PlanEntity>;
}

export { UseCase as GetPlanByIdUseCase };
