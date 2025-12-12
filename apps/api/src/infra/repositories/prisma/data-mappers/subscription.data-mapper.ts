import { Subscription as PrismaSubscription, SubscriptionStatus as PrismaSubscriptionStatus, RenewalInterval as PrismaRenewalInterval } from '@prisma/client';
import { SubscriptionEntity, SubscriptionStatus } from '@/domain/entities/billing/subscription.entity.js';
import { RenewalInterval } from '@/domain/entities/billing/plan.entity.js';

const statusToPrisma: Record<SubscriptionStatus, PrismaSubscriptionStatus> = {
  [SubscriptionStatus.INCOMPLETE]: 'incomplete',
  [SubscriptionStatus.INCOMPLETE_EXPIRED]: 'incomplete_expired',
  [SubscriptionStatus.TRIALING]: 'trialing',
  [SubscriptionStatus.ACTIVE]: 'active',
  [SubscriptionStatus.PAST_DUE]: 'past_due',
  [SubscriptionStatus.UNPAID]: 'unpaid',
  [SubscriptionStatus.CANCELED]: 'canceled',
  [SubscriptionStatus.EXPIRED]: 'expired',
};

const statusFromPrisma: Record<PrismaSubscriptionStatus, SubscriptionStatus> = {
  incomplete: SubscriptionStatus.INCOMPLETE,
  incomplete_expired: SubscriptionStatus.INCOMPLETE_EXPIRED,
  trialing: SubscriptionStatus.TRIALING,
  active: SubscriptionStatus.ACTIVE,
  past_due: SubscriptionStatus.PAST_DUE,
  unpaid: SubscriptionStatus.UNPAID,
  canceled: SubscriptionStatus.CANCELED,
  expired: SubscriptionStatus.EXPIRED,
};

export class SubscriptionDataMapper {
  static toDomain(raw: PrismaSubscription): SubscriptionEntity {
    return new SubscriptionEntity({
      id: raw.id,
      unit_id: raw.unit_id,
      user_id: raw.user_id,
      plan_id: raw.plan_id,
      status: statusFromPrisma[raw.status],
      start_date: raw.start_date,
      current_period_start: raw.current_period_start,
      current_period_end: raw.current_period_end,
      cancel_at_period_end: raw.cancel_at_period_end,
      canceled_at: raw.canceled_at ?? undefined,
      trial_end: raw.trial_end ?? undefined,
      renewal_interval: raw.renewal_interval as RenewalInterval,
      discount_id: raw.discount_id ?? undefined,
      provider_subscription_id: raw.provider_subscription_id ?? undefined,
      metadata: raw.metadata as Record<string, any> | undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: SubscriptionEntity): Omit<PrismaSubscription, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      user_id: entity.user_id,
      plan_id: entity.plan_id,
      status: statusToPrisma[entity.status],
      start_date: entity.start_date,
      current_period_start: entity.current_period_start,
      current_period_end: entity.current_period_end,
      cancel_at_period_end: entity.cancel_at_period_end,
      canceled_at: entity.canceled_at ?? null,
      trial_end: entity.trial_end ?? null,
      renewal_interval: entity.renewal_interval as PrismaRenewalInterval,
      discount_id: entity.discount_id ?? null,
      provider_subscription_id: entity.provider_subscription_id ?? null,
      metadata: entity.metadata ?? null,
    };
  }

  static toPrismaCreate(entity: SubscriptionEntity): Omit<PrismaSubscription, 'updated_at'> {
    return {
      ...SubscriptionDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    };
  }
}
