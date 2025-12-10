export interface CreateCheckoutSessionParams {
  user_id: string;
  plan_id: string;
  success_url: string;
  cancel_url: string;
  coupon_code?: string;
  trial_days?: number;
  metadata?: Record<string, any>;
}

export interface CheckoutSession {
  id: string;
  checkout_url: string;
  expires_at: Date;
  metadata?: Record<string, any>;
}

export interface CreateSubscriptionParams {
  user_id: string;
  plan_id: string;
  trial_end?: Date;
  metadata?: Record<string, any>;
}

export interface UpdateSubscriptionParams {
  plan_id?: string;
  cancel_at_period_end?: boolean;
  metadata?: Record<string, any>;
}

export interface CreateInvoiceParams {
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  description: string;
  due_date: Date;
  metadata?: Record<string, any>;
}

export interface ProviderSubscription {
  id: string;
  status: string;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  trial_end?: Date;
  metadata?: Record<string, any>;
}

export interface ProviderInvoice {
  id: string;
  amount: number;
  status: string;
  paid_at?: Date;
  payment_method_type?: string; // 'pix', 'credit_card', etc.
  metadata?: Record<string, any>;
}

export enum WebhookEventType {
  CHECKOUT_COMPLETED = 'checkout.completed',
  SUBSCRIPTION_CREATED = 'subscription.created',
  SUBSCRIPTION_UPDATED = 'subscription.updated',
  SUBSCRIPTION_CANCELED = 'subscription.canceled',
  INVOICE_PAID = 'invoice.paid',
  INVOICE_PAYMENT_FAILED = 'invoice.payment_failed',
}

export interface WebhookEvent {
  type: WebhookEventType;
  data: Record<string, any>;
}

export interface IPaymentGateway {
  /**
   * Cria uma sessão de checkout externa
   * Retorna URL para redirecionar o usuário
   */
  create_checkout_session(params: CreateCheckoutSessionParams): Promise<CheckoutSession>;

  /**
   * Cria uma subscription no provider (chamado via webhook após checkout)
   */
  create_subscription(params: CreateSubscriptionParams): Promise<ProviderSubscription>;

  /**
   * Atualiza subscription no provider
   */
  update_subscription(
    subscription_id: string,
    params: UpdateSubscriptionParams,
  ): Promise<ProviderSubscription>;

  /**
   * Cancela subscription no provider
   */
  cancel_subscription(
    subscription_id: string,
    cancel_at_period_end: boolean,
  ): Promise<ProviderSubscription>;

  /**
   * Reativa subscription no provider
   */
  reactivate_subscription(subscription_id: string): Promise<ProviderSubscription>;

  /**
   * Cria invoice no provider
   */
  create_invoice(params: CreateInvoiceParams): Promise<ProviderInvoice>;

  /**
   * Verifica assinatura do webhook
   */
  verify_webhook_signature(payload: string, signature: string): boolean;

  /**
   * Parseia evento do webhook
   */
  parse_webhook_event(payload: string): WebhookEvent;
}
