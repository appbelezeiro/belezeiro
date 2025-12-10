import {
  NotificationEntity,
  NotificationChannel,
  NotificationStatus,
  NotificationPriority,
} from '@/domain/entities/notification.entity';

export interface NotificationPersistence {
  id: string;
  target_user_id: string;
  channel: NotificationChannel;
  template_id: string;
  payload: Record<string, any>;
  priority: NotificationPriority;
  status: NotificationStatus;
  provider_id?: string;
  error_message?: string;
  metadata?: Record<string, any>;
  message_id: string;
  sent_at?: Date;
  delivered_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export class NotificationDataMapper {
  static toDomain(raw: NotificationPersistence): NotificationEntity {
    return new NotificationEntity({
      id: raw.id,
      target_user_id: raw.target_user_id,
      channel: raw.channel,
      template_id: raw.template_id,
      payload: raw.payload,
      priority: raw.priority,
      status: raw.status,
      provider_id: raw.provider_id,
      error_message: raw.error_message,
      metadata: raw.metadata,
      message_id: raw.message_id,
      sent_at: raw.sent_at,
      delivered_at: raw.delivered_at,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: NotificationEntity): NotificationPersistence {
    return {
      id: entity.id,
      target_user_id: entity.target_user_id,
      channel: entity.channel,
      template_id: entity.template_id,
      payload: entity.payload,
      priority: entity.priority,
      status: entity.status,
      provider_id: entity.provider_id,
      error_message: entity.error_message,
      metadata: entity.metadata,
      message_id: entity.message_id,
      sent_at: entity.sent_at,
      delivered_at: entity.delivered_at,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
