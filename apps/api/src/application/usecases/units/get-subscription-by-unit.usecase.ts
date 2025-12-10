import { SubscriptionEntity } from '@/domain/entities/billing/subscription.entity';
import { ISubscriptionRepository } from '@/application/contracts/billing/i-subscription-repository.interface';
import { SubscriptionNotFoundError } from '@/domain/errors/billing/subscription.errors';

class UseCase {
  constructor(private readonly subscription_repository: ISubscriptionRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const subscription = await this.subscription_repository.find_by_unit_id(input.unit_id);

    if (!subscription) {
      throw new SubscriptionNotFoundError(`Subscription for unit ${input.unit_id} not found`);
    }

    return subscription;
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
  };

  export type Output = Promise<SubscriptionEntity>;
}

export { UseCase as GetSubscriptionByUnitUseCase };
