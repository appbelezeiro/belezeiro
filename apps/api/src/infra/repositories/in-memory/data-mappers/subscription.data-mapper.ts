import { SubscriptionEntity, SubscriptionStatus } from '@/domain/entities/subscription.entity';
import { RenewalInterval } from '@/domain/entities/plan.entity';

export interface SubscriptionPersistence {
  id: string;
  unit_id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: Date;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  canceled_at?: Date;
  trial_end?: Date;
  renewal_interval: RenewalInterval;
  discount_id?: string;
  provider_subscription_id?: string;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export class SubscriptionDataMapper {
  static toDomain(raw: SubscriptionPersistence): SubscriptionEntity {
    return new SubscriptionEntity({
      id: raw.id,
      unit_id: raw.unit_id,
      user_id: raw.user_id,
      plan_id: raw.plan_id,
      status: raw.status,
      start_date: raw.start_date,
      current_period_start: raw.current_period_start,
      current_period_end: raw.current_period_end,
      cancel_at_period_end: raw.cancel_at_period_end,
      canceled_at: raw.canceled_at,
      trial_end: raw.trial_end,
      renewal_interval: raw.renewal_interval,
      discount_id: raw.discount_id,
      provider_subscription_id: raw.provider_subscription_id,
      metadata: raw.metadata,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: SubscriptionEntity): SubscriptionPersistence {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      user_id: entity.user_id,
      plan_id: entity.plan_id,
      status: entity.status,
      start_date: entity.start_date,
      current_period_start: entity.current_period_start,
      current_period_end: entity.current_period_end,
      cancel_at_period_end: entity.cancel_at_period_end,
      canceled_at: entity.canceled_at,
      trial_end: entity.trial_end,
      renewal_interval: entity.renewal_interval,
      discount_id: entity.discount_id,
      provider_subscription_id: entity.provider_subscription_id,
      metadata: entity.metadata,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
