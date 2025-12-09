import { JoseTokenService } from '@/infra/services/jose-token-service';

export function createServices() {
  const token_service = new JoseTokenService();

  return {
    token_service,
  };
}

export type Services = ReturnType<typeof createServices>;
