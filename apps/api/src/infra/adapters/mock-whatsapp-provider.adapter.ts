import { IWhatsAppProvider } from '@/application/contracts/i-whatsapp-provider.interface';
import { v4 as uuidv4 } from 'uuid';

type SentWhatsApp = {
  provider_id: string;
  to: string;
  message: string;
  template_id?: string;
  variables?: Record<string, any>;
  metadata?: Record<string, any>;
  sent_at: Date;
};

export class MockWhatsAppProviderAdapter implements IWhatsAppProvider {
  private sent_messages: SentWhatsApp[] = [];
  private should_fail = false;

  async send_whatsapp(input: {
    to: string;
    message: string;
    template_id?: string;
    variables?: Record<string, any>;
    metadata?: Record<string, any>;
  }): Promise<{ provider_id?: string }> {
    if (this.should_fail) {
      throw new Error('Mock WhatsApp provider configured to fail');
    }

    const provider_id = `mock_whatsapp_${uuidv4()}`;

    this.sent_messages.push({
      provider_id,
      to: input.to,
      message: input.message,
      template_id: input.template_id,
      variables: input.variables,
      metadata: input.metadata,
      sent_at: new Date(),
    });

    // Simula latência de rede
    await this.delay(150);

    console.log(`[MockWhatsAppProvider] Message sent to ${input.to}`);

    return { provider_id };
  }

  // Métodos auxiliares para testes
  get_sent_messages(): SentWhatsApp[] {
    return this.sent_messages;
  }

  clear_sent_messages(): void {
    this.sent_messages = [];
  }

  set_should_fail(value: boolean): void {
    this.should_fail = value;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
