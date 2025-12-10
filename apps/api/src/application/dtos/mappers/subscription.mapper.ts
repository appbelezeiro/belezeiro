import { SubscriptionEntity } from '@/domain/entities/subscription.entity';
import { PlanEntity } from '@/domain/entities/plan.entity';
import {
  SubscriptionDTO,
  SubscriptionWithPlanDTO,
  SubscriptionListItemDTO,
} from '../subscription.dto';
import { PlanMapper } from './plan.mapper';

export class SubscriptionMapper {
  static toDTO(entity: SubscriptionEntity): SubscriptionDTO {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      user_id: entity.user_id,
      plan_id: entity.plan_id,
      status: entity.status,
      start_date: entity.start_date,
      current_period_start: entity.current_period_start,
      current_period_end: entity.current_period_end,
      cancel_at_period_end: entity.cancel_at_period_end,
      canceled_at: entity.canceled_at,
      trial_end: entity.trial_end,
      renewal_interval: entity.renewal_interval,
      discount_id: entity.discount_id,
      provider_subscription_id: entity.provider_subscription_id,
      metadata: entity.metadata,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toWithPlan(
    entity: SubscriptionEntity,
    plan: PlanEntity,
  ): SubscriptionWithPlanDTO {
    return {
      ...this.toDTO(entity),
      plan: PlanMapper.toDTO(plan),
    };
  }

  static toListItem(entity: SubscriptionEntity): SubscriptionListItemDTO {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      plan_id: entity.plan_id,
      status: entity.status,
      current_period_start: entity.current_period_start,
      current_period_end: entity.current_period_end,
      cancel_at_period_end: entity.cancel_at_period_end,
    };
  }

  static toDTOList(entities: SubscriptionEntity[]): SubscriptionDTO[] {
    return entities.map(this.toDTO);
  }

  static toListItemList(entities: SubscriptionEntity[]): SubscriptionListItemDTO[] {
    return entities.map(this.toListItem);
  }
}
