import { SubscriptionEntity, SubscriptionStatus } from '@/domain/entities/billing/subscription.entity';
import { ISubscriptionRepository } from '@/application/contracts/billing/i-subscription-repository.interface';
import { SubscriptionNotFoundError } from '@/domain/errors/billing/subscription.errors';

class UseCase {
  constructor(private readonly subscription_repository: ISubscriptionRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Find subscription by provider ID
    const subscription = await this.subscription_repository.find_by_provider_id(
      input.provider_subscription_id,
    );

    if (!subscription) {
      throw new SubscriptionNotFoundError(
        `Subscription with provider ID ${input.provider_subscription_id} not found`,
      );
    }

    // 2. Update subscription status if provided
    if (input.status) {
      subscription.update_status(input.status);
    }

    // 3. Update billing period if provided
    if (input.current_period_start && input.current_period_end) {
      subscription.update_period(input.current_period_start, input.current_period_end);
    }

    // 4. Update cancel_at_period_end if provided
    if (input.cancel_at_period_end !== undefined) {
      if (input.cancel_at_period_end) {
        subscription.cancel(false); // Cancel at period end
      } else if (subscription.cancel_at_period_end) {
        // If cancel_at_period_end was true and now is false, cancel immediately
        subscription.cancel(true);
      }
    }

    // 5. Update plan if changed
    if (input.plan_id && input.plan_id !== subscription.plan_id) {
      subscription.update_plan(input.plan_id);
    }

    // 6. Save updated subscription
    return this.subscription_repository.update(subscription);
  }
}

declare namespace UseCase {
  export type Input = {
    provider_subscription_id: string;
    status?: SubscriptionStatus;
    current_period_start?: Date;
    current_period_end?: Date;
    cancel_at_period_end?: boolean;
    plan_id?: string;
    metadata?: Record<string, any>;
  };

  export type Output = Promise<SubscriptionEntity>;
}

export { UseCase as HandleSubscriptionUpdatedWebhookUseCase };
