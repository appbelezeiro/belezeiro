import { NotificationEntity } from '@/domain/entities/notification.entity';

export interface INotificationRepository {
  create(entity: NotificationEntity): Promise<NotificationEntity>;
  find_by_id(id: string): Promise<NotificationEntity | null>;
  find_by_message_id(message_id: string): Promise<NotificationEntity | null>;
  list_by_user_id(user_id: string): Promise<NotificationEntity[]>;
  list_pending(): Promise<NotificationEntity[]>;
  update(entity: NotificationEntity): Promise<NotificationEntity>;
  delete(id: string): Promise<boolean>;
}
