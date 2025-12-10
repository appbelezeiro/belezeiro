import { NotificationTemplateEntity } from '@/domain/entities/notification-template.entity';
import { INotificationTemplateRepository } from '@/application/contracts/i-notification-template-repository.interface';
import {
  NotificationTemplateDataMapper,
  NotificationTemplatePersistence,
} from './data-mappers/notification-template.data-mapper';

export class InMemoryNotificationTemplateRepository
  implements INotificationTemplateRepository
{
  private items: NotificationTemplatePersistence[] = [];

  async create(
    entity: NotificationTemplateEntity
  ): Promise<NotificationTemplateEntity> {
    const persistence = NotificationTemplateDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return NotificationTemplateDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<NotificationTemplateEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? NotificationTemplateDataMapper.toDomain(item) : null;
  }

  async find_by_name_and_channel(
    name: string,
    channel: 'email' | 'whatsapp' | 'push'
  ): Promise<NotificationTemplateEntity | null> {
    const item = this.items.find((i) => i.name === name && i.channel === channel);
    return item ? NotificationTemplateDataMapper.toDomain(item) : null;
  }

  async list_active(): Promise<NotificationTemplateEntity[]> {
    return this.items
      .filter((i) => i.is_active)
      .map(NotificationTemplateDataMapper.toDomain);
  }

  async list_all(): Promise<NotificationTemplateEntity[]> {
    return this.items.map(NotificationTemplateDataMapper.toDomain);
  }

  async update(
    entity: NotificationTemplateEntity
  ): Promise<NotificationTemplateEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`NotificationTemplate with id ${entity.id} not found`);
    }

    const persistence = NotificationTemplateDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return NotificationTemplateDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
