import { NotificationPreferenceEntity } from '@/domain/entities/notifications/notification-preference.entity';
import { INotificationPreferenceRepository } from '@/application/contracts/notifications/i-notification-preference-repository.interface';
import {
  NotificationPreferenceDataMapper,
  NotificationPreferencePersistence,
} from '../data-mappers/notifications/notification-preference.data-mapper';

export class InMemoryNotificationPreferenceRepository
  implements INotificationPreferenceRepository
{
  private items: NotificationPreferencePersistence[] = [];

  async create(
    entity: NotificationPreferenceEntity
  ): Promise<NotificationPreferenceEntity> {
    const persistence = NotificationPreferenceDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return NotificationPreferenceDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<NotificationPreferenceEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? NotificationPreferenceDataMapper.toDomain(item) : null;
  }

  async find_by_user_and_category(
    user_id: string,
    category: 'transactional' | 'marketing' | 'security' | 'billing'
  ): Promise<NotificationPreferenceEntity | null> {
    const item = this.items.find(
      (i) => i.user_id === user_id && i.category === category
    );
    return item ? NotificationPreferenceDataMapper.toDomain(item) : null;
  }

  async list_by_user_id(user_id: string): Promise<NotificationPreferenceEntity[]> {
    return this.items
      .filter((i) => i.user_id === user_id)
      .map(NotificationPreferenceDataMapper.toDomain);
  }

  async update(
    entity: NotificationPreferenceEntity
  ): Promise<NotificationPreferenceEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`NotificationPreference with id ${entity.id} not found`);
    }

    const persistence = NotificationPreferenceDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return NotificationPreferenceDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
