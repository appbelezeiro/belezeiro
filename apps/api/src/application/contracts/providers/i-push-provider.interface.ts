export interface IPushProvider {
  send_push(input: {
    user_id?: string;
    token?: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    metadata?: Record<string, any>;
  }): Promise<{ provider_id?: string }>;
}
