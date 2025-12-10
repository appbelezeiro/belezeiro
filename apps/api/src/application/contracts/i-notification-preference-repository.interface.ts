import { NotificationPreferenceEntity } from '@/domain/entities/notification-preference.entity';

export interface INotificationPreferenceRepository {
  create(entity: NotificationPreferenceEntity): Promise<NotificationPreferenceEntity>;
  find_by_id(id: string): Promise<NotificationPreferenceEntity | null>;
  find_by_user_and_category(
    user_id: string,
    category: 'transactional' | 'marketing' | 'security' | 'billing'
  ): Promise<NotificationPreferenceEntity | null>;
  list_by_user_id(user_id: string): Promise<NotificationPreferenceEntity[]>;
  update(entity: NotificationPreferenceEntity): Promise<NotificationPreferenceEntity>;
  delete(id: string): Promise<boolean>;
}
