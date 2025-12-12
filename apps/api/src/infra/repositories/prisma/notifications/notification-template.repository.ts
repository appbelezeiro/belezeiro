import { INotificationTemplateRepository } from '@/application/contracts/notifications/i-notification-template-repository.interface.js';
import { NotificationTemplateEntity, TemplateChannel } from '@/domain/entities/notifications/notification-template.entity.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { NotificationTemplateDataMapper } from '../data-mappers/index.js';
import { NotificationTemplateChannel } from '@prisma/client';

export class PrismaNotificationTemplateRepository implements INotificationTemplateRepository {
  async create(entity: NotificationTemplateEntity): Promise<NotificationTemplateEntity> {
    const data = NotificationTemplateDataMapper.toPrismaCreate(entity);
    const created = await prisma.notificationTemplate.create({ data });
    return NotificationTemplateDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<NotificationTemplateEntity | null> {
    const found = await prisma.notificationTemplate.findUnique({ where: { id } });
    return found ? NotificationTemplateDataMapper.toDomain(found) : null;
  }

  async find_by_name_and_channel(
    name: string,
    channel: TemplateChannel,
  ): Promise<NotificationTemplateEntity | null> {
    const found = await prisma.notificationTemplate.findUnique({
      where: {
        name_channel: { name, channel: channel as NotificationTemplateChannel },
      },
    });
    return found ? NotificationTemplateDataMapper.toDomain(found) : null;
  }

  async list_active(): Promise<NotificationTemplateEntity[]> {
    const templates = await prisma.notificationTemplate.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
    });
    return templates.map(NotificationTemplateDataMapper.toDomain);
  }

  async list_all(): Promise<NotificationTemplateEntity[]> {
    const templates = await prisma.notificationTemplate.findMany({
      orderBy: { created_at: 'desc' },
    });
    return templates.map(NotificationTemplateDataMapper.toDomain);
  }

  async update(entity: NotificationTemplateEntity): Promise<NotificationTemplateEntity> {
    const data = NotificationTemplateDataMapper.toPrisma(entity);
    const updated = await prisma.notificationTemplate.update({
      where: { id: entity.id },
      data,
    });
    return NotificationTemplateDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.notificationTemplate.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
