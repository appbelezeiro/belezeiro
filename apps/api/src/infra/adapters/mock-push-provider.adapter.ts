import { IPushProvider } from '@/application/contracts/i-push-provider.interface';
import { v4 as uuidv4 } from 'uuid';

type SentPush = {
  provider_id: string;
  user_id?: string;
  token?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  metadata?: Record<string, any>;
  sent_at: Date;
};

export class MockPushProviderAdapter implements IPushProvider {
  private sent_pushes: SentPush[] = [];
  private should_fail = false;

  async send_push(input: {
    user_id?: string;
    token?: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    metadata?: Record<string, any>;
  }): Promise<{ provider_id?: string }> {
    if (this.should_fail) {
      throw new Error('Mock push provider configured to fail');
    }

    const provider_id = `mock_push_${uuidv4()}`;

    this.sent_pushes.push({
      provider_id,
      user_id: input.user_id,
      token: input.token,
      title: input.title,
      body: input.body,
      data: input.data,
      metadata: input.metadata,
      sent_at: new Date(),
    });

    // Simula latência de rede
    await this.delay(80);

    console.log(
      `[MockPushProvider] Push sent to ${input.user_id || input.token}: ${input.title}`
    );

    return { provider_id };
  }

  // Métodos auxiliares para testes
  get_sent_pushes(): SentPush[] {
    return this.sent_pushes;
  }

  clear_sent_pushes(): void {
    this.sent_pushes = [];
  }

  set_should_fail(value: boolean): void {
    this.should_fail = value;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
