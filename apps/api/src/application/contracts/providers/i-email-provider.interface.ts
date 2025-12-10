export interface IEmailProvider {
  send_email(input: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    metadata?: Record<string, any>;
  }): Promise<{ provider_id?: string }>;
}
