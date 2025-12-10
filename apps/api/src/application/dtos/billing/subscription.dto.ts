import { SubscriptionStatus } from '@/domain/entities/billing/subscription.entity';
import { RenewalInterval } from '@/domain/entities/billing/plan.entity';
import { PlanDTO } from './plan.dto';

export interface SubscriptionDTO {
  id: string;
  unit_id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: Date;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  canceled_at?: Date;
  trial_end?: Date;
  renewal_interval: RenewalInterval;
  discount_id?: string;
  provider_subscription_id?: string;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionWithPlanDTO extends SubscriptionDTO {
  plan: PlanDTO;
}

export interface SubscriptionListItemDTO {
  id: string;
  unit_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
}
