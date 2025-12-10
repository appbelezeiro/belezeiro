import {
  NotificationTemplateEntity,
  TemplateChannel,
} from '@/domain/entities/notifications/notification-template.entity';

export interface NotificationTemplatePersistence {
  id: string;
  name: string;
  channel: TemplateChannel;
  subject?: string;
  body_template: string;
  title_template?: string;
  variables: string[];
  version: number;
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export class NotificationTemplateDataMapper {
  static toDomain(raw: NotificationTemplatePersistence): NotificationTemplateEntity {
    return new NotificationTemplateEntity({
      id: raw.id,
      name: raw.name,
      channel: raw.channel,
      subject: raw.subject,
      body_template: raw.body_template,
      title_template: raw.title_template,
      variables: raw.variables,
      version: raw.version,
      is_active: raw.is_active,
      metadata: raw.metadata,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(
    entity: NotificationTemplateEntity
  ): NotificationTemplatePersistence {
    return {
      id: entity.id,
      name: entity.name,
      channel: entity.channel,
      subject: entity.subject,
      body_template: entity.body_template,
      title_template: entity.title_template,
      variables: entity.variables,
      version: entity.version,
      is_active: entity.is_active,
      metadata: entity.metadata,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
