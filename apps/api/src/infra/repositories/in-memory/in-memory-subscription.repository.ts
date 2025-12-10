import { SubscriptionEntity, SubscriptionStatus } from '@/domain/entities/subscription.entity';
import { ISubscriptionRepository } from '@/application/contracts/i-subscription-repository.interface';
import { SubscriptionDataMapper, SubscriptionPersistence } from './data-mappers/subscription.data-mapper';

export class InMemorySubscriptionRepository implements ISubscriptionRepository {
  private items: SubscriptionPersistence[] = [];

  async create(entity: SubscriptionEntity): Promise<SubscriptionEntity> {
    const persistence = SubscriptionDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return SubscriptionDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<SubscriptionEntity | null> {
    const item = this.items.find((s) => s.id === id);
    return item ? SubscriptionDataMapper.toDomain(item) : null;
  }

  async find_by_unit_id(unit_id: string): Promise<SubscriptionEntity | null> {
    const item = this.items.find((s) => s.unit_id === unit_id);
    return item ? SubscriptionDataMapper.toDomain(item) : null;
  }

  async find_by_user_id(user_id: string): Promise<SubscriptionEntity[]> {
    return this.items
      .filter((s) => s.user_id === user_id)
      .map(SubscriptionDataMapper.toDomain);
  }

  async find_by_provider_id(provider_id: string): Promise<SubscriptionEntity | null> {
    const item = this.items.find((s) => s.provider_subscription_id === provider_id);
    return item ? SubscriptionDataMapper.toDomain(item) : null;
  }

  async update(entity: SubscriptionEntity): Promise<SubscriptionEntity> {
    const index = this.items.findIndex((s) => s.id === entity.id);
    if (index === -1) {
      throw new Error(`Subscription with id ${entity.id} not found`);
    }

    const persistence = SubscriptionDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return SubscriptionDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((s) => s.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  async find_expiring_trials(days: number): Promise<SubscriptionEntity[]> {
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return this.items
      .filter((s) => {
        return (
          s.status === SubscriptionStatus.TRIALING &&
          s.trial_end !== undefined &&
          s.trial_end <= threshold &&
          s.trial_end > now
        );
      })
      .map(SubscriptionDataMapper.toDomain);
  }

  async find_by_status(status: SubscriptionStatus): Promise<SubscriptionEntity[]> {
    return this.items
      .filter((s) => s.status === status)
      .map(SubscriptionDataMapper.toDomain);
  }

  async list_all(): Promise<SubscriptionEntity[]> {
    return this.items.map(SubscriptionDataMapper.toDomain);
  }
}
