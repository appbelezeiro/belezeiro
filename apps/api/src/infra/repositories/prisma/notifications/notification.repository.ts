import { INotificationRepository } from '@/application/contracts/notifications/i-notification-repository.interface.js';
import { NotificationEntity } from '@/domain/entities/notifications/notification.entity.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { NotificationDataMapper } from '../data-mappers/index.js';

export class PrismaNotificationRepository implements INotificationRepository {
  async create(entity: NotificationEntity): Promise<NotificationEntity> {
    const data = NotificationDataMapper.toPrismaCreate(entity);
    const created = await prisma.notification.create({ data });
    return NotificationDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<NotificationEntity | null> {
    const found = await prisma.notification.findUnique({ where: { id } });
    return found ? NotificationDataMapper.toDomain(found) : null;
  }

  async find_by_message_id(message_id: string): Promise<NotificationEntity | null> {
    const found = await prisma.notification.findUnique({ where: { message_id } });
    return found ? NotificationDataMapper.toDomain(found) : null;
  }

  async list_by_user_id(user_id: string): Promise<NotificationEntity[]> {
    const notifications = await prisma.notification.findMany({
      where: { target_user_id: user_id },
      orderBy: { created_at: 'desc' },
    });
    return notifications.map(NotificationDataMapper.toDomain);
  }

  async list_pending(): Promise<NotificationEntity[]> {
    const notifications = await prisma.notification.findMany({
      where: { status: 'pending' },
      orderBy: [
        { priority: 'desc' },
        { created_at: 'asc' },
      ],
    });
    return notifications.map(NotificationDataMapper.toDomain);
  }

  async update(entity: NotificationEntity): Promise<NotificationEntity> {
    const data = NotificationDataMapper.toPrisma(entity);
    const updated = await prisma.notification.update({
      where: { id: entity.id },
      data,
    });
    return NotificationDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.notification.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
