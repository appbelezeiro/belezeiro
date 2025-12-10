import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreateCheckoutSessionUseCase } from './create-checkout-session.usecase';
import { InMemoryPlanRepository } from '@/infra/repositories/in-memory/billing/in-memory-plan.repository';
import { PlanEntity } from '@/domain/entities/billing/plan.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { PlanNotFoundError, PlanNotActiveError } from '@/domain/errors/billing/plan.errors';
import {
  IPaymentGateway,
  ProviderSubscription,
  CreateCheckoutSessionParams,
  CheckoutSession,
  CreateSubscriptionParams,
  UpdateSubscriptionParams,
  CreateInvoiceParams,
  ProviderInvoice,
} from '@/domain/services/billing/i-payment-gateway.service';

class MockPaymentGateway implements IPaymentGateway {
  async create_checkout_session(params: CreateCheckoutSessionParams): Promise<CheckoutSession> {
    return {
      id: 'checkout_123',
      checkout_url: `https://payment.provider/checkout/${params.plan_id}`,
      expires_at: new Date(Date.now() + 3600000),
      metadata: params.metadata,
    };
  }

  async create_subscription(params: CreateSubscriptionParams): Promise<ProviderSubscription> {
    return {
      id: 'sub_provider_123',
      status: 'active',
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancel_at_period_end: false,
    };
  }

  async update_subscription(
    subscription_id: string,
    params: UpdateSubscriptionParams,
  ): Promise<ProviderSubscription> {
    return {
      id: subscription_id,
      status: 'active',
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancel_at_period_end: false,
    };
  }

  async cancel_subscription(
    subscription_id: string,
    cancel_at_period_end: boolean,
  ): Promise<ProviderSubscription> {
    return {
      id: subscription_id,
      status: 'canceled',
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancel_at_period_end,
    };
  }

  async reactivate_subscription(subscription_id: string): Promise<ProviderSubscription> {
    return {
      id: subscription_id,
      status: 'active',
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancel_at_period_end: false,
    };
  }

  async create_invoice(params: CreateInvoiceParams): Promise<ProviderInvoice> {
    return {
      id: 'inv_123',
      amount: params.amount,
      status: 'pending',
    };
  }

  verify_webhook_signature(payload: string, signature: string): boolean {
    return true;
  }

  parse_webhook_event(payload: string): any {
    return {};
  }
}

describe('CreateCheckoutSessionUseCase', () => {
  let sut: CreateCheckoutSessionUseCase;
  let plan_repository: InMemoryPlanRepository;
  let payment_gateway: MockPaymentGateway;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    plan_repository = new InMemoryPlanRepository();
    payment_gateway = new MockPaymentGateway();
    sut = new CreateCheckoutSessionUseCase(plan_repository, payment_gateway);
  });

  it('should create checkout session for active plan', async () => {
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

    const input = {
      user_id: 'user_123',
      plan_id: plan.id,
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    };

    const result = await sut.execute(input);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('checkout_url');
    expect(result).toHaveProperty('expires_at');
    expect(result.checkout_url).toContain(plan.id);
  });

  it('should throw PlanNotFoundError when plan does not exist', async () => {
    const input = {
      user_id: 'user_123',
      plan_id: 'non_existent_plan',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    };

    await expect(sut.execute(input)).rejects.toThrow(PlanNotFoundError);
  });

  it('should throw PlanNotActiveError when plan is inactive', async () => {
    const plan = new PlanEntity({
      name: 'Inactive Plan',
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

    plan.deactivate();
    await plan_repository.create(plan);

    const input = {
      user_id: 'user_123',
      plan_id: plan.id,
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    };

    await expect(sut.execute(input)).rejects.toThrow(PlanNotActiveError);
  });

  it('should pass coupon code to payment gateway', async () => {
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

    const input = {
      user_id: 'user_123',
      plan_id: plan.id,
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      coupon_code: 'SAVE20',
    };

    const result = await sut.execute(input);

    expect(result).toHaveProperty('checkout_url');
  });

  it('should pass trial days to payment gateway', async () => {
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
      trial_days: 7,
    });

    await plan_repository.create(plan);

    const input = {
      user_id: 'user_123',
      plan_id: plan.id,
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      trial_days: 14,
    };

    const result = await sut.execute(input);

    expect(result).toHaveProperty('checkout_url');
  });

  it('should pass metadata to payment gateway', async () => {
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

    const input = {
      user_id: 'user_123',
      plan_id: plan.id,
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      metadata: {
        campaign: 'summer_2024',
        source: 'landing_page',
      },
    };

    const result = await sut.execute(input);

    expect(result).toHaveProperty('checkout_url');
    expect(result.metadata).toEqual({
      campaign: 'summer_2024',
      source: 'landing_page',
    });
  });
});
