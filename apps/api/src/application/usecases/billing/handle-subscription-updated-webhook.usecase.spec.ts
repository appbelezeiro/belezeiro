import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { HandleSubscriptionUpdatedWebhookUseCase } from './handle-subscription-updated-webhook.usecase';
import { InMemorySubscriptionRepository } from '@/infra/repositories/in-memory/billing/in-memory-subscription.repository';
import { SubscriptionEntity, SubscriptionStatus } from '@/domain/entities/billing/subscription.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { SubscriptionNotFoundError } from '@/domain/errors/billing/subscription.errors';
import { RenewalInterval } from '@/domain/entities/billing/plan.entity';

describe('HandleSubscriptionUpdatedWebhookUseCase', () => {
  let sut: HandleSubscriptionUpdatedWebhookUseCase;
  let subscription_repository: InMemorySubscriptionRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    subscription_repository = new InMemorySubscriptionRepository();
    sut = new HandleSubscriptionUpdatedWebhookUseCase(subscription_repository);
  });

  it('should update subscription status', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.ACTIVE,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: RenewalInterval.MONTHLY,
      provider_subscription_id: 'sub_provider_123',
    });

    await subscription_repository.create(subscription);

    const input = {
      provider_subscription_id: 'sub_provider_123',
      status: SubscriptionStatus.PAST_DUE,
    };

    const result = await sut.execute(input);

    expect(result.status).toBe(SubscriptionStatus.PAST_DUE);
  });

  it('should update billing period', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.ACTIVE,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: RenewalInterval.MONTHLY,
      provider_subscription_id: 'sub_provider_123',
    });

    await subscription_repository.create(subscription);

    const new_period_start = new Date();
    const new_period_end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const input = {
      provider_subscription_id: 'sub_provider_123',
      current_period_start: new_period_start,
      current_period_end: new_period_end,
    };

    const result = await sut.execute(input);

    expect(result.current_period_start).toEqual(new_period_start);
    expect(result.current_period_end).toEqual(new_period_end);
  });

  it('should update cancel_at_period_end flag', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.ACTIVE,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: RenewalInterval.MONTHLY,
      provider_subscription_id: 'sub_provider_123',
    });

    await subscription_repository.create(subscription);

    const input = {
      provider_subscription_id: 'sub_provider_123',
      cancel_at_period_end: true,
    };

    const result = await sut.execute(input);

    expect(result.cancel_at_period_end).toBe(true);
    expect(result.status).toBe(SubscriptionStatus.ACTIVE);
    expect(result.canceled_at).toBeUndefined();
  });

  it('should update plan when plan_id changes', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.ACTIVE,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: RenewalInterval.MONTHLY,
      provider_subscription_id: 'sub_provider_123',
    });

    await subscription_repository.create(subscription);

    const input = {
      provider_subscription_id: 'sub_provider_123',
      plan_id: 'plan_456',
    };

    const result = await sut.execute(input);

    expect(result.plan_id).toBe('plan_456');
  });

  it('should not update plan when plan_id is the same', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.ACTIVE,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: RenewalInterval.MONTHLY,
      provider_subscription_id: 'sub_provider_123',
    });

    await subscription_repository.create(subscription);

    const input = {
      provider_subscription_id: 'sub_provider_123',
      plan_id: 'plan_123',
    };

    const result = await sut.execute(input);

    expect(result.plan_id).toBe('plan_123');
  });

  it('should throw SubscriptionNotFoundError when subscription does not exist', async () => {
    const input = {
      provider_subscription_id: 'non_existent_provider_id',
      status: SubscriptionStatus.CANCELED,
    };

    await expect(sut.execute(input)).rejects.toThrow(SubscriptionNotFoundError);
  });

  it('should update multiple fields at once', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.ACTIVE,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: RenewalInterval.MONTHLY,
      provider_subscription_id: 'sub_provider_123',
    });

    await subscription_repository.create(subscription);

    const new_period_start = new Date();
    const new_period_end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const input = {
      provider_subscription_id: 'sub_provider_123',
      status: SubscriptionStatus.PAST_DUE,
      current_period_start: new_period_start,
      current_period_end: new_period_end,
      plan_id: 'plan_456',
    };

    const result = await sut.execute(input);

    expect(result.status).toBe(SubscriptionStatus.PAST_DUE);
    expect(result.current_period_start).toEqual(new_period_start);
    expect(result.current_period_end).toEqual(new_period_end);
    expect(result.plan_id).toBe('plan_456');
  });

  it('should handle updates with no changes', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.ACTIVE,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: RenewalInterval.MONTHLY,
      provider_subscription_id: 'sub_provider_123',
    });

    await subscription_repository.create(subscription);

    const input = {
      provider_subscription_id: 'sub_provider_123',
    };

    const result = await sut.execute(input);

    expect(result.id).toBe(subscription.id);
    expect(result.status).toBe(SubscriptionStatus.ACTIVE);
  });

  it('should not cancel when cancel_at_period_end is false', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.ACTIVE,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: RenewalInterval.MONTHLY,
      provider_subscription_id: 'sub_provider_123',
    });

    subscription.cancel(false);
    await subscription_repository.create(subscription);

    const input = {
      provider_subscription_id: 'sub_provider_123',
      cancel_at_period_end: false,
    };

    const result = await sut.execute(input);

    expect(result.status).toBe(SubscriptionStatus.CANCELED);
  });
});
