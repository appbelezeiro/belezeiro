import { DiscountEntity } from '@/domain/entities/discount.entity';
import { DiscountDTO, DiscountValidationDTO } from '../discount.dto';

export class DiscountMapper {
  static toDTO(entity: DiscountEntity): DiscountDTO {
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

  static toValidation(entity: DiscountEntity): DiscountValidationDTO {
    return {
      id: entity.id,
      code: entity.code,
      type: entity.type,
      value: entity.value,
      duration: entity.duration,
      repeating_count: entity.repeating_count,
      is_active: entity.is_active,
      expires_at: entity.expires_at,
      can_be_redeemed: entity.can_be_redeemed(),
    };
  }

  static toDTOList(entities: DiscountEntity[]): DiscountDTO[] {
    return entities.map(this.toDTO);
  }

  static toValidationList(entities: DiscountEntity[]): DiscountValidationDTO[] {
    return entities.map(this.toValidation);
  }
}
