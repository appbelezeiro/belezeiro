import { IPlanRepository } from '@/application/contracts/billing/i-plan-repository.interface';
import { IPaymentGateway, CheckoutSession } from '@/domain/services/billing/i-payment-gateway.service';
import { PlanNotFoundError, PlanNotActiveError } from '@/domain/errors/billing/plan.errors';

class UseCase {
  constructor(
    private readonly plan_repository: IPlanRepository,
    private readonly payment_gateway: IPaymentGateway,
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Verify plan exists and is active
    const plan = await this.plan_repository.find_by_id(input.plan_id);

    if (!plan) {
      throw new PlanNotFoundError(`Plan with ID ${input.plan_id} not found`);
    }

    if (!plan.is_active) {
      throw new PlanNotActiveError(`Plan ${input.plan_id} is not active`);
    }

    // 2. Create checkout session via payment gateway
    const checkout_session = await this.payment_gateway.create_checkout_session({
      user_id: input.user_id,
      plan_id: input.plan_id,
      success_url: input.success_url,
      cancel_url: input.cancel_url,
      coupon_code: input.coupon_code,
      trial_days: input.trial_days,
      metadata: input.metadata,
    });

    return checkout_session;
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    plan_id: string;
    success_url: string;
    cancel_url: string;
    coupon_code?: string;
    trial_days?: number;
    metadata?: Record<string, any>;
  };

  export type Output = Promise<CheckoutSession>;
}

export { UseCase as CreateCheckoutSessionUseCase };
