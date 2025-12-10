export type NotificationChannel = 'email' | 'whatsapp' | 'push';
export type NotificationPriority = 'low' | 'normal' | 'high';

export type NotificationEvent = {
  notification_id: string;
  message_id: string;
  target_user_id: string;
  channel: NotificationChannel;
  template_id: string;
  payload: Record<string, any>;
  priority: NotificationPriority;
  metadata?: Record<string, any>;
};
