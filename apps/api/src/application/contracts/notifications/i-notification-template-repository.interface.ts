import { NotificationTemplateEntity } from '@/domain/entities/notifications/notification-template.entity';

export interface INotificationTemplateRepository {
  create(entity: NotificationTemplateEntity): Promise<NotificationTemplateEntity>;
  find_by_id(id: string): Promise<NotificationTemplateEntity | null>;
  find_by_name_and_channel(
    name: string,
    channel: 'email' | 'whatsapp' | 'push'
  ): Promise<NotificationTemplateEntity | null>;
  list_active(): Promise<NotificationTemplateEntity[]>;
  list_all(): Promise<NotificationTemplateEntity[]>;
  update(entity: NotificationTemplateEntity): Promise<NotificationTemplateEntity>;
  delete(id: string): Promise<boolean>;
}
