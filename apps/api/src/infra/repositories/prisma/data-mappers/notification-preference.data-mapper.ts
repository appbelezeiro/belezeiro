import {
  NotificationPreference as PrismaNotificationPreference,
  NotificationPreferenceCategory as PrismaNotificationPreferenceCategory,
  Prisma,
} from '@prisma/client';
import {
  NotificationPreferenceEntity,
  NotificationCategory,
} from '@/domain/entities/notifications/notification-preference.entity.js';

type ChannelPreferences = {
  email: boolean;
  whatsapp: boolean;
  push: boolean;
};

export class NotificationPreferenceDataMapper {
  static toDomain(raw: PrismaNotificationPreference): NotificationPreferenceEntity {
    return new NotificationPreferenceEntity({
      id: raw.id,
      user_id: raw.user_id,
      category: raw.category as NotificationCategory,
      channels: raw.channels as ChannelPreferences,
      metadata: raw.metadata as Record<string, any> | undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: NotificationPreferenceEntity): Prisma.NotificationPreferenceUncheckedUpdateInput {
    return {
      id: entity.id,
      user_id: entity.user_id,
      category: entity.category as PrismaNotificationPreferenceCategory,
      channels: entity.channels as Prisma.InputJsonValue,
      metadata: entity.metadata ? (entity.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
    };
  }

  static toPrismaCreate(entity: NotificationPreferenceEntity): Prisma.NotificationPreferenceUncheckedCreateInput {
    return {
      ...NotificationPreferenceDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    } as Prisma.NotificationPreferenceUncheckedCreateInput;
  }
}
