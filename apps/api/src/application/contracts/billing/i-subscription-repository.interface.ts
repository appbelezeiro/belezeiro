import { SubscriptionEntity, SubscriptionStatus } from '@/domain/entities/billing/subscription.entity';

export interface ISubscriptionRepository {
  create(entity: SubscriptionEntity): Promise<SubscriptionEntity>;
  find_by_id(id: string): Promise<SubscriptionEntity | null>;
  find_by_unit_id(unit_id: string): Promise<SubscriptionEntity | null>;
  find_by_user_id(user_id: string): Promise<SubscriptionEntity[]>;
  find_by_provider_id(provider_id: string): Promise<SubscriptionEntity | null>;
  update(entity: SubscriptionEntity): Promise<SubscriptionEntity>;
  delete(id: string): Promise<boolean>;

  // Métodos específicos
  find_expiring_trials(days: number): Promise<SubscriptionEntity[]>;
  find_by_status(status: SubscriptionStatus): Promise<SubscriptionEntity[]>;
  list_all(): Promise<SubscriptionEntity[]>;
}
