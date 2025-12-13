import {
  Notification as PrismaNotification,
  NotificationChannel as PrismaNotificationChannel,
  NotificationStatus as PrismaNotificationStatus,
  NotificationPriority as PrismaNotificationPriority,
  Prisma,
} from '@prisma/client';
import {
  NotificationEntity,
  NotificationChannel,
  NotificationStatus,
  NotificationPriority,
} from '@/domain/entities/notifications/notification.entity.js';

export class NotificationDataMapper {
  static toDomain(raw: PrismaNotification): NotificationEntity {
    return new NotificationEntity({
      id: raw.id,
      target_user_id: raw.target_user_id,
      channel: raw.channel as NotificationChannel,
      template_id: raw.template_id,
      payload: raw.payload as Record<string, any>,
      priority: raw.priority as NotificationPriority,
      status: raw.status as NotificationStatus,
      provider_id: raw.provider_id ?? undefined,
      error_message: raw.error_message ?? undefined,
      metadata: raw.metadata as Record<string, any> | undefined,
      message_id: raw.message_id,
      sent_at: raw.sent_at ?? undefined,
      delivered_at: raw.delivered_at ?? undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: NotificationEntity): Prisma.NotificationUncheckedUpdateInput {
    return {
      id: entity.id,
      target_user_id: entity.target_user_id,
      channel: entity.channel as PrismaNotificationChannel,
      template_id: entity.template_id,
      payload: entity.payload as Prisma.InputJsonValue,
      priority: entity.priority as PrismaNotificationPriority,
      status: entity.status as PrismaNotificationStatus,
      provider_id: entity.provider_id ?? null,
      error_message: entity.error_message ?? null,
      metadata: entity.metadata ? (entity.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
      message_id: entity.message_id,
      sent_at: entity.sent_at ?? null,
      delivered_at: entity.delivered_at ?? null,
      read_at: null,
    };
  }

  static toPrismaCreate(entity: NotificationEntity): Prisma.NotificationUncheckedCreateInput {
    return {
      ...NotificationDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    } as Prisma.NotificationUncheckedCreateInput;
  }
}
