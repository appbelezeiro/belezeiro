export interface IWhatsAppProvider {
  send_whatsapp(input: {
    to: string;
    message: string;
    template_id?: string;
    variables?: Record<string, any>;
    metadata?: Record<string, any>;
  }): Promise<{ provider_id?: string }>;
}
