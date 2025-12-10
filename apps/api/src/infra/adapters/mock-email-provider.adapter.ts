import { IEmailProvider } from '@/application/contracts/providers/i-email-provider.interface';
import { v4 as uuidv4 } from 'uuid';

type SentEmail = {
  provider_id: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  metadata?: Record<string, any>;
  sent_at: Date;
};

export class MockEmailProviderAdapter implements IEmailProvider {
  private sent_emails: SentEmail[] = [];
  private should_fail = false;

  async send_email(input: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    metadata?: Record<string, any>;
  }): Promise<{ provider_id?: string }> {
    if (this.should_fail) {
      throw new Error('Mock email provider configured to fail');
    }

    const provider_id = `mock_email_${uuidv4()}`;

    this.sent_emails.push({
      provider_id,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      metadata: input.metadata,
      sent_at: new Date(),
    });

    // Simula latência de rede
    await this.delay(100);

    console.log(`[MockEmailProvider] Email sent to ${input.to}: ${input.subject}`);

    return { provider_id };
  }

  // Métodos auxiliares para testes
  get_sent_emails(): SentEmail[] {
    return this.sent_emails;
  }

  clear_sent_emails(): void {
    this.sent_emails = [];
  }

  set_should_fail(value: boolean): void {
    this.should_fail = value;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
