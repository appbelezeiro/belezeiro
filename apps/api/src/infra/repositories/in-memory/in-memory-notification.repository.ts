import { NotificationEntity } from '@/domain/entities/notification.entity';
import { INotificationRepository } from '@/application/contracts/i-notification-repository.interface';
import {
  NotificationDataMapper,
  NotificationPersistence,
} from './data-mappers/notification.data-mapper';

export class InMemoryNotificationRepository implements INotificationRepository {
  private items: NotificationPersistence[] = [];

  async create(entity: NotificationEntity): Promise<NotificationEntity> {
    const persistence = NotificationDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return NotificationDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<NotificationEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? NotificationDataMapper.toDomain(item) : null;
  }

  async find_by_message_id(message_id: string): Promise<NotificationEntity | null> {
    const item = this.items.find((i) => i.message_id === message_id);
    return item ? NotificationDataMapper.toDomain(item) : null;
  }

  async list_by_user_id(user_id: string): Promise<NotificationEntity[]> {
    return this.items
      .filter((i) => i.target_user_id === user_id)
      .map(NotificationDataMapper.toDomain);
  }

  async list_pending(): Promise<NotificationEntity[]> {
    return this.items
      .filter((i) => i.status === 'pending')
      .map(NotificationDataMapper.toDomain);
  }

  async update(entity: NotificationEntity): Promise<NotificationEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`Notification with id ${entity.id} not found`);
    }

    const persistence = NotificationDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return NotificationDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
