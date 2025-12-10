import { SubscriptionEntity } from '@/domain/entities/subscription.entity';
import { ISubscriptionRepository } from '@/application/contracts/i-subscription-repository.interface';
import { IPaymentGateway } from '@/domain/services/i-payment-gateway.service';
import { SubscriptionNotFoundError } from '@/domain/errors/subscription.errors';

class UseCase {
  constructor(
    private readonly subscription_repository: ISubscriptionRepository,
    private readonly payment_gateway: IPaymentGateway,
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Find subscription
    const subscription = await this.subscription_repository.find_by_id(input.subscription_id);

    if (!subscription) {
      throw new SubscriptionNotFoundError(
        `Subscription with ID ${input.subscription_id} not found`,
      );
    }

    // 2. Cancel in payment gateway (if provider subscription exists)
    if (subscription.provider_subscription_id) {
      await this.payment_gateway.cancel_subscription(
        subscription.provider_subscription_id,
        input.cancel_at_period_end ?? false,
      );
    }

    // 3. Update subscription entity
    subscription.cancel(input.cancel_at_period_end ?? false);

    // 4. Save updated subscription
    return this.subscription_repository.update(subscription);
  }
}

declare namespace UseCase {
  export type Input = {
    subscription_id: string;
    cancel_at_period_end?: boolean;
  };

  export type Output = Promise<SubscriptionEntity>;
}

export { UseCase as CancelSubscriptionUseCase };
