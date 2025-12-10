import { PlanEntity } from '@/domain/entities/billing/plan.entity';
import { PlanDTO, PlanListItemDTO } from '../../billing/plan.dto';

export class PlanMapper {
  static toDTO(entity: PlanEntity): PlanDTO {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      currency: entity.currency,
      interval: entity.interval,
      features: entity.features,
      limits: entity.limits,
      trial_days: entity.trial_days,
      is_active: entity.is_active,
      metadata: entity.metadata,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toListItem(entity: PlanEntity): PlanListItemDTO {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      currency: entity.currency,
      interval: entity.interval,
      is_active: entity.is_active,
    };
  }

  static toDTOList(entities: PlanEntity[]): PlanDTO[] {
    return entities.map(this.toDTO);
  }

  static toListItemList(entities: PlanEntity[]): PlanListItemDTO[] {
    return entities.map(this.toListItem);
  }
}
