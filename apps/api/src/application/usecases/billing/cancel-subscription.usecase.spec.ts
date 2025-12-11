import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CancelSubscriptionUseCase } from './cancel-subscription.usecase';
import { InMemorySubscriptionRepository } from '@/infra/repositories/in-memory/billing/in-memory-subscription.repository';
import { SubscriptionEntity, SubscriptionStatus } from '@/domain/entities/billing/subscription.entity';
import { RenewalInterval } from '@/domain/entities/billing/plan.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { SubscriptionNotFoundError } from '@/domain/errors/billing/subscription.errors';
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

// Mock implementation of IPaymentGateway
class MockPaymentGateway implements IPaymentGateway {
  async create_checkout_session(params: CreateCheckoutSessionParams): Promise<CheckoutSession> {
    return {
      id: 'checkout_123',
      checkout_url: 'https://payment.provider/checkout/123',
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
      metadata: params.metadata,
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
      cancel_at_period_end: params.cancel_at_period_end ?? false,
      metadata: params.metadata,
    };
  }

  async cancel_subscription(
    subscription_id: string,
    cancel_at_period_end: boolean,
  ): Promise<ProviderSubscription> {
    return {
      id: subscription_id,
      status: cancel_at_period_end ? 'active' : 'canceled',
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
      metadata: params.metadata,
    };
  }

  verify_webhook_signature(_payload: string, _signature: string): boolean {
    return true;
  }

  parse_webhook_event(_payload: string): any {
    return {};
  }
}

describe('CancelSubscriptionUseCase', () => {
  let sut: CancelSubscriptionUseCase;
  let subscription_repository: InMemorySubscriptionRepository;
  let payment_gateway: MockPaymentGateway;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    subscription_repository = new InMemorySubscriptionRepository();
    payment_gateway = new MockPaymentGateway();
    sut = new CancelSubscriptionUseCase(subscription_repository, payment_gateway);
  });

  it('should cancel subscription immediately', async () => {
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
      subscription_id: subscription.id,
      cancel_at_period_end: false,
    };

    const result = await sut.execute(input);

    expect(result.status).toBe(SubscriptionStatus.CANCELED);
    expect(result.canceled_at).toBeInstanceOf(Date);
    expect(result.cancel_at_period_end).toBe(false);
  });

  it('should cancel subscription at period end', async () => {
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
      subscription_id: subscription.id,
      cancel_at_period_end: true,
    };

    const result = await sut.execute(input);

    expect(result.status).toBe(SubscriptionStatus.ACTIVE);
    expect(result.cancel_at_period_end).toBe(true);
    expect(result.canceled_at).toBeInstanceOf(Date);
  });

  it('should cancel subscription in payment gateway when provider_subscription_id exists', async () => {
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
      subscription_id: subscription.id,
      cancel_at_period_end: false,
    };

    await sut.execute(input);

    // Verify it was persisted
    const updated = await subscription_repository.find_by_id(subscription.id);
    expect(updated?.status).toBe(SubscriptionStatus.CANCELED);
  });

  it('should throw SubscriptionNotFoundError when subscription does not exist', async () => {
    const input = {
      subscription_id: 'non_existent_id',
      cancel_at_period_end: false,
    };

    await expect(sut.execute(input)).rejects.toThrow(SubscriptionNotFoundError);
  });

  it('should handle subscription without provider_subscription_id', async () => {
    const subscription = new SubscriptionEntity({
      unit_id: 'unit_123',
      user_id: 'user_123',
      plan_id: 'plan_123',
      status: SubscriptionStatus.ACTIVE,
      start_date: new Date(),
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_interval: RenewalInterval.MONTHLY,
    });

    await subscription_repository.create(subscription);

    const input = {
      subscription_id: subscription.id,
      cancel_at_period_end: false,
    };

    const result = await sut.execute(input);

    expect(result.status).toBe(SubscriptionStatus.CANCELED);
  });

  it('should default cancel_at_period_end to false when not provided', async () => {
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
      subscription_id: subscription.id,
    };

    const result = await sut.execute(input);

    expect(result.status).toBe(SubscriptionStatus.CANCELED);
    expect(result.cancel_at_period_end).toBe(false);
  });
});
