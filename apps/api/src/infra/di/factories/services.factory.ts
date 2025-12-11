import { JoseTokenService } from '@/infra/services/auth/jose-token-service';
import { FakePaymentGatewayService } from '@/infra/services/billing/fake-payment-gateway.service';
import { SubscriptionLifecycleService } from '@/infra/services/billing/subscription-lifecycle.service';
import { PlanLimitsValidatorService } from '@/infra/services/billing/plan-limits-validator.service';
import { S3StorageGatewayService } from '@/infra/services/storage/s3-storage-gateway.service';
import { R2StorageGatewayService } from '@/infra/services/storage/r2-storage-gateway.service';
import { FakeStorageGatewayService } from '@/infra/services/storage/fake-storage-gateway.service';

export function createServices() {
  const token_service = new JoseTokenService();

  // Billing services
  const payment_gateway = new FakePaymentGatewayService();
  const subscription_lifecycle_service = new SubscriptionLifecycleService();
  const plan_limits_validator_service = new PlanLimitsValidatorService();

  // Storage service
  // STORAGE_PROVIDER: 's3', 'r2', ou 'fake'
  // Use 'fake' para desenvolvimento sem cloud storage
  // Use 'r2' ou 's3' para usar cloud storage (funciona em dev e prod)
  const storage_provider = process.env.STORAGE_PROVIDER || 'fake';

  let storage_gateway;

  if (storage_provider === 's3') {
    storage_gateway = new S3StorageGatewayService({
      region: process.env.AWS_REGION!,
      access_key_id: process.env.AWS_ACCESS_KEY_ID!,
      secret_access_key: process.env.AWS_SECRET_ACCESS_KEY!,
      bucket_name: process.env.AWS_S3_BUCKET!,
      cdn_url: process.env.AWS_CLOUDFRONT_URL,
    });
  } else if (storage_provider === 'r2') {
    storage_gateway = new R2StorageGatewayService({
      account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
      access_key_id: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
      secret_access_key: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
      bucket_name: process.env.R2_BUCKET!,
      public_url: process.env.R2_PUBLIC_URL,
    });
  } else {
    storage_gateway = new FakeStorageGatewayService();
  }

  return {
    token_service,
    payment_gateway,
    subscription_lifecycle_service,
    plan_limits_validator_service,
    storage_gateway,
  };
}

export type Services = ReturnType<typeof createServices>;
