import { SubscriptionEntity, SubscriptionStatus } from '@/domain/entities/subscription.entity';
import { ISubscriptionRepository } from '@/application/contracts/i-subscription-repository.interface';
import { IPlanRepository } from '@/application/contracts/i-plan-repository.interface';
import { IDiscountRepository } from '@/application/contracts/i-discount-repository.interface';
import { PlanNotFoundError } from '@/domain/errors/plan.errors';

class UseCase {
  constructor(
    private readonly subscription_repository: ISubscriptionRepository,
    private readonly plan_repository: IPlanRepository,
    private readonly discount_repository: IDiscountRepository,
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Verify plan exists
    const plan = await this.plan_repository.find_by_id(input.plan_id);

    if (!plan) {
      throw new PlanNotFoundError(`Plan with ID ${input.plan_id} not found`);
    }

    // 2. Handle discount if provided
    let discount_id: string | undefined;
    if (input.discount_code) {
      const discount = await this.discount_repository.find_by_code(input.discount_code);
      if (discount && discount.can_be_redeemed()) {
        discount.redeem();
        await this.discount_repository.update(discount);
        discount_id = discount.id;
      }
    }

    // 3. Calculate trial end date
    let trial_end: Date | undefined;
    if (input.trial_days && input.trial_days > 0) {
      trial_end = new Date();
      trial_end.setDate(trial_end.getDate() + input.trial_days);
    }

    // 4. Create subscription
    const subscription = new SubscriptionEntity({
      unit_id: input.unit_id,
      user_id: input.user_id,
      plan_id: input.plan_id,
      status: trial_end ? SubscriptionStatus.TRIALING : SubscriptionStatus.ACTIVE,
      start_date: input.start_date,
      current_period_start: input.current_period_start,
      current_period_end: input.current_period_end,
      trial_end,
      renewal_interval: plan.interval,
      discount_id,
      provider_subscription_id: input.provider_subscription_id,
      metadata: input.metadata,
    });

    return this.subscription_repository.create(subscription);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    user_id: string;
    plan_id: string;
    start_date: Date;
    current_period_start: Date;
    current_period_end: Date;
    provider_subscription_id: string;
    discount_code?: string;
    trial_days?: number;
    metadata?: Record<string, any>;
  };

  export type Output = Promise<SubscriptionEntity>;
}

export { UseCase as HandleCheckoutCompletedWebhookUseCase };
