import { SubscriptionEntity } from '@/domain/entities/billing/subscription.entity';
import { PlanEntity } from '@/domain/entities/billing/plan.entity';

export interface IPlanLimitsValidatorService {
  /**
   * Valida se o user ainda tem limite para criar booking
   */
  can_create_booking(
    subscription: SubscriptionEntity,
    plan: PlanEntity,
    current_bookings_count: number,
  ): boolean;

  /**
   * Valida se o user pode acessar uma feature
   */
  has_feature_access(
    subscription: SubscriptionEntity,
    plan: PlanEntity,
    feature: string,
  ): boolean;

  /**
   * Retorna limite restante
   */
  get_remaining_limit(
    subscription: SubscriptionEntity,
    plan: PlanEntity,
    limit_key: string,
    current_usage: number,
  ): number;

  /**
   * Valida se subscription está ativa e pode acessar features
   */
  validate_subscription_access(subscription: SubscriptionEntity): boolean;
}
