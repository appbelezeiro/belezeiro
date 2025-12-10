import { IPlanLimitsValidatorService } from '@/domain/services/i-plan-limits-validator.service';
import { SubscriptionEntity, SubscriptionStatus } from '@/domain/entities/subscription.entity';
import { PlanEntity, PlanFeatures } from '@/domain/entities/plan.entity';

export class PlanLimitsValidatorService implements IPlanLimitsValidatorService {
  can_create_booking(
    subscription: SubscriptionEntity,
    plan: PlanEntity,
    current_bookings_count: number,
  ): boolean {
    // Valida se subscription está ativa
    if (!this.validate_subscription_access(subscription)) {
      return false;
    }

    const max_bookings = plan.get_limit('max_bookings_per_month');

    // Se -1, significa ilimitado
    if (max_bookings === -1) {
      return true;
    }

    return current_bookings_count < max_bookings;
  }

  has_feature_access(
    subscription: SubscriptionEntity,
    plan: PlanEntity,
    feature: string,
  ): boolean {
    // Valida se subscription está ativa
    if (!this.validate_subscription_access(subscription)) {
      return false;
    }

    // Verifica se a feature existe no plano
    return plan.has_feature(feature as keyof PlanFeatures);
  }

  get_remaining_limit(
    subscription: SubscriptionEntity,
    plan: PlanEntity,
    limit_key: string,
    current_usage: number,
  ): number {
    // Valida se subscription está ativa
    if (!this.validate_subscription_access(subscription)) {
      return 0;
    }

    const total_limit = plan.limits[limit_key as keyof typeof plan.limits];

    // Se -1, significa ilimitado
    if (total_limit === -1) {
      return -1;
    }

    const remaining = total_limit - current_usage;
    return Math.max(0, remaining);
  }

  validate_subscription_access(subscription: SubscriptionEntity): boolean {
    // Subscription pode acessar features se está:
    // - ACTIVE
    // - TRIALING
    // - PAST_DUE (permite acesso temporário para não bloquear o usuário)

    const allowed_statuses = [
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.TRIALING,
      SubscriptionStatus.PAST_DUE,
    ];

    return allowed_statuses.includes(subscription.status);
  }
}
