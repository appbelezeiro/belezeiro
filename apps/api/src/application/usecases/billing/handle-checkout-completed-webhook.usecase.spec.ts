import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { HandleCheckoutCompletedWebhookUseCase } from './handle-checkout-completed-webhook.usecase';
import { InMemorySubscriptionRepository } from '@/infra/repositories/in-memory/billing/in-memory-subscription.repository';
import { InMemoryPlanRepository } from '@/infra/repositories/in-memory/billing/in-memory-plan.repository';
import { InMemoryDiscountRepository } from '@/infra/repositories/in-memory/billing/in-memory-discount.repository';
import { PlanEntity } from '@/domain/entities/billing/plan.entity';
import { DiscountEntity } from '@/domain/entities/billing/discount.entity';
import { SubscriptionStatus } from '@/domain/entities/billing/subscription.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { PlanNotFoundError } from '@/domain/errors/billing/plan.errors';

describe('HandleCheckoutCompletedWebhookUseCase', () => {
  let sut: HandleCheckoutCompletedWebhookUseCase;
  let subscription_repository: InMemorySubscriptionRepository;
  let plan_repository: InMemoryPlanRepository;
  let discount_repository: InMemoryDiscountRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    subscription_repository = new InMemorySubscriptionRepository();
    plan_repository = new InMemoryPlanRepository();
    discount_repository = new InMemoryDiscountRepository();
    sut = new HandleCheckoutCompletedWebhookUseCase(
      subscription_repository,
      plan_repository,
      discount_repository,
    );
  });

  it('should create subscription after successful checkout', async () => {
    const plan = new PlanEntity({
      name: 'Pro Plan',
      price: 9900,
      currency: 'BRL',
      interval: 'monthly',
      features: {
        professionals: 10,
        bookings_per_month: 1000,
        custom_branding: true,
      },
      limits: {
        max_units: 5,
        max_users_per_unit: 20,
      },
    });

    await plan_repository.create(plan);

    const now = new Date();
    const period_end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const input = {
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: plan.id,
      start_date: now,
      current_period_start: now,
      current_period_end: period_end,
      provider_subscription_id: 'sub_provider_123',
    };

    const result = await sut.execute(input);

    expect(result.unit_id).toBe('unit_123');
    expect(result.user_id).toBe('user_123');
    expect(result.plan_id).toBe(plan.id);
    expect(result.status).toBe(SubscriptionStatus.ACTIVE);
    expect(result.provider_subscription_id).toBe('sub_provider_123');
  });

  it('should throw PlanNotFoundError when plan does not exist', async () => {
    const now = new Date();
    const period_end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const input = {
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'non_existent_plan',
      start_date: now,
      current_period_start: now,
      current_period_end: period_end,
      provider_subscription_id: 'sub_provider_123',
    };

    await expect(sut.execute(input)).rejects.toThrow(PlanNotFoundError);
  });

  it('should create subscription with trial period', async () => {
    const plan = new PlanEntity({
      name: 'Pro Plan',
      price: 9900,
      currency: 'BRL',
      interval: 'monthly',
      features: {
        professionals: 10,
        bookings_per_month: 1000,
        custom_branding: true,
      },
      limits: {
        max_units: 5,
        max_users_per_unit: 20,
      },
      trial_days: 14,
    });

    await plan_repository.create(plan);

    const now = new Date();
    const period_end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const input = {
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: plan.id,
      start_date: now,
      current_period_start: now,
      current_period_end: period_end,
      provider_subscription_id: 'sub_provider_123',
      trial_days: 14,
    };

    const result = await sut.execute(input);

    expect(result.status).toBe(SubscriptionStatus.TRIALING);
    expect(result.trial_end).toBeInstanceOf(Date);
  });

  it('should apply discount code when provided', async () => {
    const plan = new PlanEntity({
      name: 'Pro Plan',
      price: 9900,
      currency: 'BRL',
      interval: 'monthly',
      features: {
        professionals: 10,
        bookings_per_month: 1000,
        custom_branding: true,
      },
      limits: {
        max_units: 5,
        max_users_per_unit: 20,
      },
    });

    const discount = new DiscountEntity({
      code: 'SAVE20',
      type: 'percentage',
      value: 20,
      max_redemptions: 100,
      valid_from: new Date(Date.now() - 24 * 60 * 60 * 1000),
      valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await plan_repository.create(plan);
    await discount_repository.create(discount);

    const now = new Date();
    const period_end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const input = {
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: plan.id,
      start_date: now,
      current_period_start: now,
      current_period_end: period_end,
      provider_subscription_id: 'sub_provider_123',
      discount_code: 'SAVE20',
    };

    const result = await sut.execute(input);

    expect(result.discount_id).toBe(discount.id);
  });

  it('should redeem discount when applied', async () => {
    const plan = new PlanEntity({
      name: 'Pro Plan',
      price: 9900,
      currency: 'BRL',
      interval: 'monthly',
      features: {
        professionals: 10,
        bookings_per_month: 1000,
        custom_branding: true,
      },
      limits: {
        max_units: 5,
        max_users_per_unit: 20,
      },
    });

    const discount = new DiscountEntity({
      code: 'SAVE20',
      type: 'percentage',
      value: 20,
      max_redemptions: 100,
      valid_from: new Date(Date.now() - 24 * 60 * 60 * 1000),
      valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await plan_repository.create(plan);
    await discount_repository.create(discount);

    const initial_redemptions = discount.current_redemptions;

    const now = new Date();
    const period_end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const input = {
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: plan.id,
      start_date: now,
      current_period_start: now,
      current_period_end: period_end,
      provider_subscription_id: 'sub_provider_123',
      discount_code: 'SAVE20',
    };

    await sut.execute(input);

    const updated_discount = await discount_repository.find_by_code('SAVE20');
    expect(updated_discount?.current_redemptions).toBe(initial_redemptions + 1);
  });

  it('should not apply invalid discount', async () => {
    const plan = new PlanEntity({
      name: 'Pro Plan',
      price: 9900,
      currency: 'BRL',
      interval: 'monthly',
      features: {
        professionals: 10,
        bookings_per_month: 1000,
        custom_branding: true,
      },
      limits: {
        max_units: 5,
        max_users_per_unit: 20,
      },
    });

    await plan_repository.create(plan);

    const now = new Date();
    const period_end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const input = {
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: plan.id,
      start_date: now,
      current_period_start: now,
      current_period_end: period_end,
      provider_subscription_id: 'sub_provider_123',
      discount_code: 'INVALID_CODE',
    };

    const result = await sut.execute(input);

    expect(result.discount_id).toBeUndefined();
  });

  it('should create subscription with metadata', async () => {
    const plan = new PlanEntity({
      name: 'Pro Plan',
      price: 9900,
      currency: 'BRL',
      interval: 'monthly',
      features: {
        professionals: 10,
        bookings_per_month: 1000,
        custom_branding: true,
      },
      limits: {
        max_units: 5,
        max_users_per_unit: 20,
      },
    });

    await plan_repository.create(plan);

    const now = new Date();
    const period_end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const input = {
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: plan.id,
      start_date: now,
      current_period_start: now,
      current_period_end: period_end,
      provider_subscription_id: 'sub_provider_123',
      metadata: {
        source: 'landing_page',
        campaign: 'summer_2024',
      },
    };

    const result = await sut.execute(input);

    expect(result.metadata).toEqual({
      source: 'landing_page',
      campaign: 'summer_2024',
    });
  });

  it('should set renewal interval from plan', async () => {
    const plan = new PlanEntity({
      name: 'Annual Plan',
      price: 99000,
      currency: 'BRL',
      interval: 'yearly',
      features: {
        professionals: 10,
        bookings_per_month: 1000,
        custom_branding: true,
      },
      limits: {
        max_units: 5,
        max_users_per_unit: 20,
      },
    });

    await plan_repository.create(plan);

    const now = new Date();
    const period_end = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    const input = {
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: plan.id,
      start_date: now,
      current_period_start: now,
      current_period_end: period_end,
      provider_subscription_id: 'sub_provider_123',
    };

    const result = await sut.execute(input);

    expect(result.renewal_interval).toBe('yearly');
  });
});
