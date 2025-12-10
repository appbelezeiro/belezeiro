import { PlanEntity, PlanFeatures, PlanLimits, RenewalInterval } from '@/domain/entities/plan.entity';

export interface PlanPersistence {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: RenewalInterval;
  features: PlanFeatures;
  limits: PlanLimits;
  trial_days?: number;
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export class PlanDataMapper {
  static toDomain(raw: PlanPersistence): PlanEntity {
    return new PlanEntity({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      price: raw.price,
      currency: raw.currency,
      interval: raw.interval,
      features: raw.features,
      limits: raw.limits,
      trial_days: raw.trial_days,
      is_active: raw.is_active,
      metadata: raw.metadata,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: PlanEntity): PlanPersistence {
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
}
