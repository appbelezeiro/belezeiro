import { RenewalInterval, PlanFeatures, PlanLimits } from '@/domain/entities/plan.entity';

export interface PlanDTO {
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

export interface PlanListItemDTO {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: RenewalInterval;
  is_active: boolean;
}
