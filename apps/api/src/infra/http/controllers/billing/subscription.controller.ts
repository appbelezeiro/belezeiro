import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { SubscriptionMapper } from '@/application/dtos/mappers/billing/subscription.mapper';
import { SubscriptionNotFoundError } from '@/domain/errors/billing/subscription.errors';
import { NotFoundError } from '../../errors/http-errors';

const CreateCheckoutSessionSchema = z.object({
  unit_id: z.string().min(1),
  plan_id: z.string().min(1),
  success_url: z.string().url(),
  cancel_url: z.string().url(),
  coupon_code: z.string().optional(),
  trial_days: z.number().int().min(0).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const CancelSubscriptionSchema = z.object({
  cancel_immediately: z.boolean().optional().default(false),
});

export class SubscriptionController {
  constructor(private readonly container: Container) {}

  async create_checkout(c: Context) {
    const body = await c.req.json();
    const payload = CreateCheckoutSessionSchema.parse(body);

    const checkout_session = await this.container.use_cases.create_checkout_session.execute({
      user_id: payload.unit_id, // TODO: pegar do auth context
      plan_id: payload.plan_id,
      success_url: payload.success_url,
      cancel_url: payload.cancel_url,
      coupon_code: payload.coupon_code,
      trial_days: payload.trial_days,
      metadata: payload.metadata,
    });

    return c.json(
      {
        checkout_session_id: checkout_session.id,
        checkout_url: checkout_session.checkout_url,
        expires_at: checkout_session.expires_at,
      },
      201,
    );
  }

  async get_by_unit(c: Context) {
    try {
      const { unit_id } = c.req.param();

      const subscription = await this.container.use_cases.get_subscription_by_unit.execute({
        unit_id,
      });

      // Buscar o plano para retornar junto
      const plan = await this.container.use_cases.get_plan_by_id.execute({
        plan_id: subscription.plan_id,
      });

      return c.json(SubscriptionMapper.toWithPlan(subscription, plan));
    } catch (error) {
      if (error instanceof SubscriptionNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }

  async cancel(c: Context) {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const payload = CancelSubscriptionSchema.parse(body);

      const subscription = await this.container.use_cases.cancel_subscription.execute({
        subscription_id: id,
        cancel_at_period_end: !payload.cancel_immediately,
      });

      return c.json(SubscriptionMapper.toDTO(subscription));
    } catch (error) {
      if (error instanceof SubscriptionNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }
}
