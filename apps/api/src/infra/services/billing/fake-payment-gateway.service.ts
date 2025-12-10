import {
  IPaymentGateway,
  CreateCheckoutSessionParams,
  CheckoutSession,
  CreateSubscriptionParams,
  UpdateSubscriptionParams,
  CreateInvoiceParams,
  ProviderSubscription,
  ProviderInvoice,
  WebhookEvent,
  WebhookEventType,
} from '@/domain/services/billing/i-payment-gateway.service';

export class FakePaymentGatewayService implements IPaymentGateway {
  private subscriptions = new Map<string, ProviderSubscription>();
  private invoices = new Map<string, ProviderInvoice>();
  private checkout_sessions = new Map<string, CheckoutSession>();

  async create_checkout_session(
    params: CreateCheckoutSessionParams,
  ): Promise<CheckoutSession> {
    const session_id = `fake_checkout_${Date.now()}`;
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 1); // Expira em 1 hora

    const session: CheckoutSession = {
      id: session_id,
      checkout_url: `https://fake-gateway.com/checkout/${session_id}`,
      expires_at,
      metadata: {
        user_id: params.user_id,
        plan_id: params.plan_id,
        coupon_code: params.coupon_code,
        trial_days: params.trial_days,
        ...params.metadata,
      },
    };

    this.checkout_sessions.set(session_id, session);
    return session;
  }

  async create_subscription(params: CreateSubscriptionParams): Promise<ProviderSubscription> {
    const subscription_id = `fake_sub_${Date.now()}`;
    const now = new Date();
    const period_end = new Date(now);
    period_end.setMonth(period_end.getMonth() + 1); // 1 mês

    const subscription: ProviderSubscription = {
      id: subscription_id,
      status: params.trial_end && params.trial_end > now ? 'trialing' : 'active',
      current_period_start: now,
      current_period_end: period_end,
      cancel_at_period_end: false,
      trial_end: params.trial_end,
      metadata: params.metadata,
    };

    this.subscriptions.set(subscription_id, subscription);
    return subscription;
  }

  async update_subscription(
    subscription_id: string,
    params: UpdateSubscriptionParams,
  ): Promise<ProviderSubscription> {
    const subscription = this.subscriptions.get(subscription_id);

    if (!subscription) {
      throw new Error(`Subscription ${subscription_id} not found`);
    }

    const updated: ProviderSubscription = {
      ...subscription,
      cancel_at_period_end: params.cancel_at_period_end ?? subscription.cancel_at_period_end,
      metadata: params.metadata ?? subscription.metadata,
    };

    this.subscriptions.set(subscription_id, updated);
    return updated;
  }

  async cancel_subscription(
    subscription_id: string,
    cancel_at_period_end: boolean,
  ): Promise<ProviderSubscription> {
    const subscription = this.subscriptions.get(subscription_id);

    if (!subscription) {
      throw new Error(`Subscription ${subscription_id} not found`);
    }

    const updated: ProviderSubscription = {
      ...subscription,
      status: cancel_at_period_end ? subscription.status : 'canceled',
      cancel_at_period_end,
    };

    this.subscriptions.set(subscription_id, updated);
    return updated;
  }

  async reactivate_subscription(subscription_id: string): Promise<ProviderSubscription> {
    const subscription = this.subscriptions.get(subscription_id);

    if (!subscription) {
      throw new Error(`Subscription ${subscription_id} not found`);
    }

    const updated: ProviderSubscription = {
      ...subscription,
      status: 'active',
      cancel_at_period_end: false,
    };

    this.subscriptions.set(subscription_id, updated);
    return updated;
  }

  async create_invoice(params: CreateInvoiceParams): Promise<ProviderInvoice> {
    const invoice_id = `fake_inv_${Date.now()}`;

    const invoice: ProviderInvoice = {
      id: invoice_id,
      amount: params.amount,
      status: 'open',
      metadata: params.metadata,
    };

    this.invoices.set(invoice_id, invoice);
    return invoice;
  }

  verify_webhook_signature(_payload: string, signature: string): boolean {
    // Fake implementation: always returns true for testing
    // In real implementation, verify HMAC signature
    return signature === 'fake_signature';
  }

  parse_webhook_event(payload: string): WebhookEvent {
    // Fake implementation: parse JSON payload
    const data = JSON.parse(payload);

    return {
      type: data.type as WebhookEventType,
      data: data.data,
    };
  }

  // Helper methods for testing

  simulate_checkout_completed(checkout_session_id: string): WebhookEvent {
    const session = this.checkout_sessions.get(checkout_session_id);

    if (!session) {
      throw new Error(`Checkout session ${checkout_session_id} not found`);
    }

    return {
      type: WebhookEventType.CHECKOUT_COMPLETED,
      data: {
        checkout_session_id,
        user_id: session.metadata?.user_id,
        plan_id: session.metadata?.plan_id,
        payment_method_type: 'credit_card',
      },
    };
  }

  simulate_invoice_paid(invoice_id: string): WebhookEvent {
    const invoice = this.invoices.get(invoice_id);

    if (!invoice) {
      throw new Error(`Invoice ${invoice_id} not found`);
    }

    const updated: ProviderInvoice = {
      ...invoice,
      status: 'paid',
      paid_at: new Date(),
    };

    this.invoices.set(invoice_id, updated);

    return {
      type: WebhookEventType.INVOICE_PAID,
      data: {
        invoice_id,
        amount: invoice.amount,
        paid_at: new Date(),
      },
    };
  }
}
