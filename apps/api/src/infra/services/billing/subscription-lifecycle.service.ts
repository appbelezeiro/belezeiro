import { ISubscriptionLifecycleService } from '@/domain/services/billing/i-subscription-lifecycle.service';
import { SubscriptionEntity, SubscriptionStatus } from '@/domain/entities/billing/subscription.entity';
import { RenewalInterval } from '@/domain/entities/billing/plan.entity';

export class SubscriptionLifecycleService implements ISubscriptionLifecycleService {
  calculate_next_period(
    current_period_end: Date,
    interval: RenewalInterval,
  ): { start: Date; end: Date } {
    const start = new Date(current_period_end);
    const end = new Date(current_period_end);

    switch (interval) {
      case RenewalInterval.MONTHLY:
        end.setMonth(end.getMonth() + 1);
        break;
      case RenewalInterval.YEARLY:
        end.setFullYear(end.getFullYear() + 1);
        break;
      case RenewalInterval.CUSTOM:
        // Para custom, default é 30 dias
        end.setDate(end.getDate() + 30);
        break;
      default:
        throw new Error(`Unknown renewal interval: ${interval}`);
    }

    return { start, end };
  }

  calculate_proration(
    current_plan_price: number,
    new_plan_price: number,
    days_remaining: number,
    total_days_in_period: number,
  ): number {
    if (total_days_in_period === 0) {
      return 0;
    }

    // Calcula o valor do plano atual já pago
    const current_plan_daily_price = current_plan_price / total_days_in_period;
    const unused_current_amount = current_plan_daily_price * days_remaining;

    // Calcula o valor do novo plano para os dias restantes
    const new_plan_daily_price = new_plan_price / total_days_in_period;
    const new_plan_amount = new_plan_daily_price * days_remaining;

    // Proration = diferença entre novo e o não utilizado do antigo
    const proration = new_plan_amount - unused_current_amount;

    // Retorna em centavos (arredondar para cima ou para baixo)
    return Math.round(proration);
  }

  can_reactivate(subscription: SubscriptionEntity): boolean {
    // Pode reativar se:
    // 1. Está cancelada
    // 2. Ainda está dentro do período de billing
    return (
      subscription.status === SubscriptionStatus.CANCELED &&
      subscription.current_period_end > new Date()
    );
  }

  should_retry_payment(subscription: SubscriptionEntity, retry_count: number): boolean {
    // Política de retry (dunning):
    // - 1ª tentativa: imediata
    // - 2ª tentativa: após 3 dias
    // - 3ª tentativa: após 5 dias
    // - 4ª tentativa: após 7 dias
    // - Após 4 tentativas, marca como unpaid

    const MAX_RETRIES = 4;

    if (retry_count >= MAX_RETRIES) {
      return false;
    }

    // Só deve tentar retry se estiver em past_due
    return subscription.status === SubscriptionStatus.PAST_DUE;
  }

  days_until_period_end(subscription: SubscriptionEntity): number {
    const now = new Date();
    const period_end = subscription.current_period_end;

    const diff_in_ms = period_end.getTime() - now.getTime();
    const diff_in_days = Math.ceil(diff_in_ms / (1000 * 60 * 60 * 24));

    return Math.max(0, diff_in_days);
  }
}
