import {
  NotificationTemplate as PrismaNotificationTemplate,
  NotificationTemplateChannel as PrismaNotificationTemplateChannel,
  Prisma,
} from '@prisma/client';
import {
  NotificationTemplateEntity,
  TemplateChannel,
} from '@/domain/entities/notifications/notification-template.entity.js';

export class NotificationTemplateDataMapper {
  static toDomain(raw: PrismaNotificationTemplate): NotificationTemplateEntity {
    return new NotificationTemplateEntity({
      id: raw.id,
      name: raw.name,
      channel: raw.channel as TemplateChannel,
      subject: raw.subject ?? undefined,
      body_template: raw.body_template,
      title_template: raw.title_template ?? undefined,
      variables: raw.variables,
      version: raw.version,
      is_active: raw.is_active,
      metadata: raw.metadata as Record<string, any> | undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: NotificationTemplateEntity): Prisma.NotificationTemplateUncheckedUpdateInput {
    return {
      id: entity.id,
      name: entity.name,
      channel: entity.channel as PrismaNotificationTemplateChannel,
      subject: entity.subject ?? null,
      body_template: entity.body_template,
      title_template: entity.title_template ?? null,
      variables: entity.variables,
      version: entity.version,
      is_active: entity.is_active,
      metadata: entity.metadata ? (entity.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
    };
  }

  static toPrismaCreate(entity: NotificationTemplateEntity): Prisma.NotificationTemplateUncheckedCreateInput {
    return {
      ...NotificationTemplateDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    } as Prisma.NotificationTemplateUncheckedCreateInput;
  }
}
