import { PlanEntity } from '@/domain/entities/billing/plan.entity';
import { IPlanRepository } from '@/application/contracts/billing/i-plan-repository.interface';

class UseCase {
  constructor(private readonly plan_repository: IPlanRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.plan_repository.list_active();
  }
}

declare namespace UseCase {
  export type Input = Record<string, never>;

  export type Output = Promise<PlanEntity[]>;
}

export { UseCase as ListActivePlansUseCase };
