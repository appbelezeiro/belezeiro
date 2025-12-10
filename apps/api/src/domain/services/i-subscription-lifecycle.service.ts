import { SubscriptionEntity } from '@/domain/entities/subscription.entity';
import { RenewalInterval } from '@/domain/entities/plan.entity';

export interface ISubscriptionLifecycleService {
  /**
   * Calcula o próximo período de cobrança
   */
  calculate_next_period(
    current_period_end: Date,
    interval: RenewalInterval,
  ): { start: Date; end: Date };

  /**
   * Calcula proration para upgrade/downgrade
   */
  calculate_proration(
    current_plan_price: number,
    new_plan_price: number,
    days_remaining: number,
    total_days_in_period: number,
  ): number;

  /**
   * Verifica se subscription pode ser reativada
   */
  can_reactivate(subscription: SubscriptionEntity): boolean;

  /**
   * Aplica retry policy (dunning) para pagamentos falhados
   */
  should_retry_payment(subscription: SubscriptionEntity, retry_count: number): boolean;

  /**
   * Calcula quantos dias faltam para o fim do período
   */
  days_until_period_end(subscription: SubscriptionEntity): number;
}
