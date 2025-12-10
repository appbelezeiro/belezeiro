import {
  NotificationPreferenceEntity,
  NotificationCategory,
} from '@/domain/entities/notification-preference.entity';

type ChannelPreferences = {
  email: boolean;
  whatsapp: boolean;
  push: boolean;
};

export interface NotificationPreferencePersistence {
  id: string;
  user_id: string;
  category: NotificationCategory;
  channels: ChannelPreferences;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export class NotificationPreferenceDataMapper {
  static toDomain(
    raw: NotificationPreferencePersistence
  ): NotificationPreferenceEntity {
    return new NotificationPreferenceEntity({
      id: raw.id,
      user_id: raw.user_id,
      category: raw.category,
      channels: raw.channels,
      metadata: raw.metadata,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(
    entity: NotificationPreferenceEntity
  ): NotificationPreferencePersistence {
    return {
      id: entity.id,
      user_id: entity.user_id,
      category: entity.category,
      channels: entity.channels,
      metadata: entity.metadata,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
