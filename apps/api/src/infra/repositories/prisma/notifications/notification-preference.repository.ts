import { INotificationPreferenceRepository } from '@/application/contracts/notifications/i-notification-preference-repository.interface.js';
import { NotificationPreferenceEntity, NotificationCategory } from '@/domain/entities/notifications/notification-preference.entity.js';
import { prisma } from '../client/index.js';
import { NotificationPreferenceDataMapper } from '../data-mappers/index.js';
import { NotificationPreferenceCategory } from '@prisma/client';

export class PrismaNotificationPreferenceRepository implements INotificationPreferenceRepository {
  async create(entity: NotificationPreferenceEntity): Promise<NotificationPreferenceEntity> {
    const data = NotificationPreferenceDataMapper.toPrismaCreate(entity);
    const created = await prisma.notificationPreference.create({ data });
    return NotificationPreferenceDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<NotificationPreferenceEntity | null> {
    const found = await prisma.notificationPreference.findUnique({ where: { id } });
    return found ? NotificationPreferenceDataMapper.toDomain(found) : null;
  }

  async find_by_user_and_category(
    user_id: string,
    category: NotificationCategory,
  ): Promise<NotificationPreferenceEntity | null> {
    const found = await prisma.notificationPreference.findUnique({
      where: {
        user_id_category: { user_id, category: category as NotificationPreferenceCategory },
      },
    });
    return found ? NotificationPreferenceDataMapper.toDomain(found) : null;
  }

  async list_by_user_id(user_id: string): Promise<NotificationPreferenceEntity[]> {
    const preferences = await prisma.notificationPreference.findMany({
      where: { user_id },
      orderBy: { category: 'asc' },
    });
    return preferences.map(NotificationPreferenceDataMapper.toDomain);
  }

  async update(entity: NotificationPreferenceEntity): Promise<NotificationPreferenceEntity> {
    const data = NotificationPreferenceDataMapper.toPrisma(entity);
    const updated = await prisma.notificationPreference.update({
      where: { id: entity.id },
      data,
    });
    return NotificationPreferenceDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.notificationPreference.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
