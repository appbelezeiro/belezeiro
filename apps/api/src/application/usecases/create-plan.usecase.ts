import { PlanEntity } from '@/domain/entities/plan.entity';
import { IPlanRepository } from '@/application/contracts/i-plan-repository.interface';

class UseCase {
  constructor(private readonly plan_repository: IPlanRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const plan = new PlanEntity({
      name: input.name,
      description: input.description,
      price: input.price,
      currency: input.currency,
      interval: input.interval,
      features: input.features,
      limits: input.limits,
      trial_days: input.trial_days,
      metadata: input.metadata,
    });

    return this.plan_repository.create(plan);
  }
}

declare namespace UseCase {
  export type Input = {
    name: string;
    description?: string;
    price: number;
    currency: string;
    interval: import('@/domain/entities/plan.entity').RenewalInterval;
    features: import('@/domain/entities/plan.entity').PlanFeatures;
    limits: import('@/domain/entities/plan.entity').PlanLimits;
    trial_days?: number;
    metadata?: Record<string, any>;
  };

  export type Output = Promise<PlanEntity>;
}

export { UseCase as CreatePlanUseCase };
