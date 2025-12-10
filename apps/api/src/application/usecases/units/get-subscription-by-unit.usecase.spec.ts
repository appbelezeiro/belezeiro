import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GetSubscriptionByUnitUseCase } from './get-subscription-by-unit.usecase';
import { InMemorySubscriptionRepository } from '@/infra/repositories/in-memory/billing/in-memory-subscription.repository';
import { SubscriptionEntity, SubscriptionStatus } from '@/domain/entities/billing/subscription.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { SubscriptionNotFoundError } from '@/domain/errors/billing/subscription.errors';

describe('GetSubscriptionByUnitUseCase', () => {
  let sut: GetSubscriptionByUnitUseCase;
  let subscription_repository: InMemorySubscriptionRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    subscription_repository = new InMemorySubscriptionRepository();
    sut = new GetSubscriptionByUnitUseCase(subscription_repository);
  });

  it('should return subscription for unit', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.ACTIVE,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: 'monthly',
    });

    await subscription_repository.create(subscription);

    const input = {
      unit_id: 'unit_123',
    };

    const result = await sut.execute(input);

    expect(result.unit_id).toBe('unit_123');
    expect(result.status).toBe(SubscriptionStatus.ACTIVE);
  });

  it('should throw SubscriptionNotFoundError when subscription does not exist', async () => {
    const input = {
      unit_id: 'non_existent_unit',
    };

    await expect(sut.execute(input)).rejects.toThrow(SubscriptionNotFoundError);
  });

  it('should return subscription with all properties', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.ACTIVE,
      start_date: new Date('2024-01-01'),
      current_period_start: new Date('2024-01-01'),
      current_period_end: new Date('2024-02-01'),
      renewal_interval: 'monthly',
      provider_subscription_id: 'sub_provider_123',
      discount_id: 'discount_123',
      metadata: {
        source: 'checkout',
      },
    });

    await subscription_repository.create(subscription);

    const input = {
      unit_id: 'unit_123',
    };

    const result = await sut.execute(input);

    expect(result.plan_id).toBe('plan_123');
    expect(result.provider_subscription_id).toBe('sub_provider_123');
    expect(result.discount_id).toBe('discount_123');
    expect(result.metadata).toEqual({ source: 'checkout' });
  });

  it('should return active subscription', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.ACTIVE,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: 'monthly',
    });

    await subscription_repository.create(subscription);

    const input = {
      unit_id: 'unit_123',
    };

    const result = await sut.execute(input);

    expect(result.status).toBe(SubscriptionStatus.ACTIVE);
  });

  it('should return trialing subscription', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.TRIALING,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: 'monthly',
      trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    await subscription_repository.create(subscription);

    const input = {
      unit_id: 'unit_123',
    };

    const result = await sut.execute(input);

    expect(result.status).toBe(SubscriptionStatus.TRIALING);
    expect(result.trial_end).toBeInstanceOf(Date);
  });

  it('should return past due subscription', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.PAST_DUE,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: 'monthly',
    });

    await subscription_repository.create(subscription);

    const input = {
      unit_id: 'unit_123',
    };

    const result = await sut.execute(input);

    expect(result.status).toBe(SubscriptionStatus.PAST_DUE);
  });

  it('should return canceled subscription', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.CANCELED,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: 'monthly',
    });

    await subscription_repository.create(subscription);

    const input = {
      unit_id: 'unit_123',
    };

    const result = await sut.execute(input);

    expect(result.status).toBe(SubscriptionStatus.CANCELED);
  });
});
