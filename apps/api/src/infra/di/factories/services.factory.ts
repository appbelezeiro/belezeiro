import { JoseTokenService } from '@/infra/services/jose-token-service';
import { FakePaymentGatewayService } from '@/infra/services/fake-payment-gateway.service';
import { SubscriptionLifecycleService } from '@/infra/services/subscription-lifecycle.service';
import { PlanLimitsValidatorService } from '@/infra/services/plan-limits-validator.service';

export function createServices() {
  const token_service = new JoseTokenService();

  // Billing services
  const payment_gateway = new FakePaymentGatewayService();
  const subscription_lifecycle_service = new SubscriptionLifecycleService();
  const plan_limits_validator_service = new PlanLimitsValidatorService();

  return {
    token_service,
    payment_gateway,
    subscription_lifecycle_service,
    plan_limits_validator_service,
  };
}

export type Services = ReturnType<typeof createServices>;
