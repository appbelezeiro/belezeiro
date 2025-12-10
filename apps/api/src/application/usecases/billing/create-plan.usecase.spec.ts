import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreatePlanUseCase } from './create-plan.usecase';
import { InMemoryPlanRepository } from '@/infra/repositories/in-memory/billing/in-memory-plan.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('CreatePlanUseCase', () => {
  let sut: CreatePlanUseCase;
  let plan_repository: InMemoryPlanRepository;

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
      interval: 'monthly' as const,
      features: {
        professionals: 10,
        bookings_per_month: 1000,
        custom_branding: true,
      },
      limits: {
        max_units: 5,
        max_users_per_unit: 20,
      },
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
      interval: 'monthly' as const,
      features: {
        professionals: 5,
        bookings_per_month: 500,
        custom_branding: false,
      },
      limits: {
        max_units: 1,
        max_users_per_unit: 10,
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
      interval: 'monthly' as const,
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
    };

    const result = await sut.execute(input);

    expect(result.trial_days).toBe(14);
  });

  it('should create plan with metadata', async () => {
    const input = {
      name: 'Enterprise Plan',
      price: 29900,
      currency: 'BRL',
      interval: 'yearly' as const,
      features: {
        professionals: 50,
        bookings_per_month: 10000,
        custom_branding: true,
      },
      limits: {
        max_units: 20,
        max_users_per_unit: 100,
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
    const intervals = ['monthly', 'yearly'] as const;

    for (const interval of intervals) {
      const input = {
        name: `${interval} Plan`,
        price: 9900,
        currency: 'BRL',
        interval,
        features: {
          professionals: 10,
          bookings_per_month: 1000,
          custom_branding: true,
        },
        limits: {
          max_units: 5,
          max_users_per_unit: 20,
        },
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
        interval: 'monthly' as const,
        features: {
          professionals: 10,
          bookings_per_month: 1000,
          custom_branding: true,
        },
        limits: {
          max_units: 5,
          max_users_per_unit: 20,
        },
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
      interval: 'monthly' as const,
      features: {
        professionals: 25,
        bookings_per_month: 5000,
        custom_branding: true,
        api_access: true,
        white_label: true,
      },
      limits: {
        max_units: 10,
        max_users_per_unit: 50,
      },
    };

    const result = await sut.execute(input);

    expect(result.features.professionals).toBe(25);
    expect(result.features.bookings_per_month).toBe(5000);
    expect(result.features.custom_branding).toBe(true);
  });

  it('should create active plan by default', async () => {
    const input = {
      name: 'Starter Plan',
      price: 2900,
      currency: 'BRL',
      interval: 'monthly' as const,
      features: {
        professionals: 3,
        bookings_per_month: 200,
        custom_branding: false,
      },
      limits: {
        max_units: 1,
        max_users_per_unit: 5,
      },
    };

    const result = await sut.execute(input);

    expect(result.is_active).toBe(true);
  });
});
