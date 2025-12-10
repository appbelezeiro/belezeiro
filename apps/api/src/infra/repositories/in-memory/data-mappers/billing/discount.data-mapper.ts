import { DiscountEntity, DiscountType, DiscountDuration } from '@/domain/entities/billing/discount.entity';

export interface DiscountPersistence {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  duration: DiscountDuration;
  repeating_count?: number;
  assigned_to_user_id?: string;
  max_redemptions?: number;
  redemptions_count: number;
  expires_at?: Date;
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export class DiscountDataMapper {
  static toDomain(raw: DiscountPersistence): DiscountEntity {
    return new DiscountEntity({
      id: raw.id,
      code: raw.code,
      type: raw.type,
      value: raw.value,
      duration: raw.duration,
      repeating_count: raw.repeating_count,
      assigned_to_user_id: raw.assigned_to_user_id,
      max_redemptions: raw.max_redemptions,
      redemptions_count: raw.redemptions_count,
      expires_at: raw.expires_at,
      is_active: raw.is_active,
      metadata: raw.metadata,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: DiscountEntity): DiscountPersistence {
    return {
      id: entity.id,
      code: entity.code,
      type: entity.type,
      value: entity.value,
      duration: entity.duration,
      repeating_count: entity.repeating_count,
      assigned_to_user_id: entity.assigned_to_user_id,
      max_redemptions: entity.max_redemptions,
      redemptions_count: entity.redemptions_count,
      expires_at: entity.expires_at,
      is_active: entity.is_active,
      metadata: entity.metadata,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
