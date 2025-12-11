import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreatePlanUseCase } from './create-plan.usecase';
import { InMemoryPlanRepository } from '@/infra/repositories/in-memory/billing/in-memory-plan.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { RenewalInterval, PlanFeatures, PlanLimits } from '@/domain/entities/billing/plan.entity';

describe('CreatePlanUseCase', () => {
  let sut: CreatePlanUseCase;
  let plan_repository: InMemoryPlanRepository;

  const defaultFeatures: PlanFeatures = {
    advanced_booking: true,
    custom_branding: true,
    analytics: true,
    api_access: false,
    priority_support: false,
    custom_integrations: false,
  };

  const defaultLimits: PlanLimits = {
    max_bookings_per_month: 1000,
    max_concurrent_bookings: 50,
    max_booking_rules: 10,
    max_team_members: 20,
    max_locations: 5,
  };

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    plan_repository = new InMemoryPlanRepository();
    sut = new CreatePlanUseCase(plan_repository);
  });

  it('should create a new plan', async () => {
    const input = {
      name: 'Pro Plan',
      description: 'Professional plan for growing businesses',
      price: 9900,
      currency: 'BRL',
      interval: RenewalInterval.MONTHLY,
      features: defaultFeatures,
      limits: defaultLimits,
    };

    const result = await sut.execute(input);

    expect(result.name).toBe(input.name);
    expect(result.description).toBe(input.description);
    expect(result.price).toBe(input.price);
    expect(result.currency).toBe(input.currency);
    expect(result.interval).toBe(input.interval);
    expect(result.is_active).toBe(true);
    expect(result.id).toContain('plan_');
  });

  it('should create plan without description', async () => {
    const input = {
      name: 'Basic Plan',
      price: 4900,
      currency: 'BRL',
      interval: RenewalInterval.MONTHLY,
      features: {
        ...defaultFeatures,
        advanced_booking: false,
        custom_branding: false,
      },
      limits: {
        ...defaultLimits,
        max_bookings_per_month: 500,
        max_team_members: 10,
        max_locations: 1,
      },
    };

    const result = await sut.execute(input);

    expect(result.name).toBe(input.name);
    expect(result.description).toBeUndefined();
    expect(result.price).toBe(input.price);
  });

  it('should create plan with trial days', async () => {
    const input = {
      name: 'Trial Plan',
      price: 9900,
      currency: 'BRL',
      interval: RenewalInterval.MONTHLY,
      features: defaultFeatures,
      limits: defaultLimits,
      trial_days: 14,
    };

    const result = await sut.execute(input);

    expect(result.trial_days).toBe(14);
  });

  it('should create plan with metadata', async () => {
    const input = {
      name: 'Enterprise Plan',
      price: 29900,
      currency: 'BRL',
      interval: RenewalInterval.YEARLY,
      features: {
        ...defaultFeatures,
        api_access: true,
        priority_support: true,
        custom_integrations: true,
      },
      limits: {
        ...defaultLimits,
        max_bookings_per_month: 10000,
        max_team_members: 100,
        max_locations: 20,
      },
      metadata: {
        tier: 'enterprise',
        priority_support: true,
      },
    };

    const result = await sut.execute(input);

    expect(result.metadata).toEqual({
      tier: 'enterprise',
      priority_support: true,
    });
  });

  it('should create plan with different intervals', async () => {
    const intervals = [RenewalInterval.MONTHLY, RenewalInterval.YEARLY];

    for (const interval of intervals) {
      const input = {
        name: `${interval} Plan`,
        price: 9900,
        currency: 'BRL',
        interval,
        features: defaultFeatures,
        limits: defaultLimits,
      };

      const result = await sut.execute(input);

      expect(result.interval).toBe(interval);
    }
  });

  it('should create plan with different currencies', async () => {
    const currencies = ['BRL', 'USD'];

    for (const currency of currencies) {
      const input = {
        name: `Plan ${currency}`,
        price: 9900,
        currency,
        interval: RenewalInterval.MONTHLY,
        features: defaultFeatures,
        limits: defaultLimits,
      };

      const result = await sut.execute(input);

      expect(result.currency).toBe(currency);
    }
  });

  it('should create plan with custom features', async () => {
    const input = {
      name: 'Custom Plan',
      price: 19900,
      currency: 'BRL',
      interval: RenewalInterval.MONTHLY,
      features: {
        advanced_booking: true,
        custom_branding: true,
        analytics: true,
        api_access: true,
        priority_support: true,
        custom_integrations: false,
      },
      limits: {
        max_bookings_per_month: 5000,
        max_concurrent_bookings: 100,
        max_booking_rules: 20,
        max_team_members: 50,
        max_locations: 10,
      },
    };

    const result = await sut.execute(input);

    expect(result.features.advanced_booking).toBe(true);
    expect(result.features.custom_branding).toBe(true);
    expect(result.features.api_access).toBe(true);
    expect(result.limits.max_bookings_per_month).toBe(5000);
    expect(result.limits.max_team_members).toBe(50);
  });

  it('should create active plan by default', async () => {
    const input = {
      name: 'Starter Plan',
      price: 2900,
      currency: 'BRL',
      interval: RenewalInterval.MONTHLY,
      features: {
        ...defaultFeatures,
        advanced_booking: false,
        custom_branding: false,
        analytics: false,
      },
      limits: {
        ...defaultLimits,
        max_bookings_per_month: 200,
        max_team_members: 5,
        max_locations: 1,
      },
    };

    const result = await sut.execute(input);

    expect(result.is_active).toBe(true);
  });
});
