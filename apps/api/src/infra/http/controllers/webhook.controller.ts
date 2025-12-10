import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { WebhookEventType } from '@/domain/services/i-payment-gateway.service';
import { UnauthorizedError } from '../errors/http-errors';

export class WebhookController {
  constructor(private readonly container: Container) {}

  async handle_payment_provider(c: Context) {
    try {
      const signature = c.req.header('x-webhook-signature') || '';
      const payload = await c.req.text();

      // 1. Verificar assinatura
      const is_valid = await this.container.services.payment_gateway.verify_webhook_signature(
        payload,
        signature,
      );

      if (!is_valid) {
        throw new UnauthorizedError('Invalid webhook signature');
      }

      // 2. Parsear evento
      const event = await this.container.services.payment_gateway.parse_webhook_event(payload);

      // 3. Processar evento
      switch (event.type) {
        case WebhookEventType.CHECKOUT_COMPLETED:
          await this.container.use_cases.handle_checkout_completed_webhook.execute({
            unit_id: event.data.unit_id,
            user_id: event.data.user_id,
            plan_id: event.data.plan_id,
            start_date: new Date(event.data.start_date),
            current_period_start: new Date(event.data.current_period_start),
            current_period_end: new Date(event.data.current_period_end),
            provider_subscription_id: event.data.provider_subscription_id,
            discount_code: event.data.discount_code,
            trial_days: event.data.trial_days,
            metadata: event.data.metadata,
          });
          break;

        case WebhookEventType.SUBSCRIPTION_UPDATED:
          await this.container.use_cases.handle_subscription_updated_webhook.execute({
            provider_subscription_id: event.data.provider_subscription_id,
            status: event.data.status,
            current_period_start: new Date(event.data.current_period_start),
            current_period_end: new Date(event.data.current_period_end),
            cancel_at_period_end: event.data.cancel_at_period_end,
            plan_id: event.data.plan_id,
            metadata: event.data.metadata,
          });
          break;

        default:
          console.log(`Unhandled webhook event type: ${event.type}`);
      }

      return c.json({ received: true }, 200);
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }
}
