import { DiscountType, DiscountDuration } from '@/domain/entities/billing/discount.entity';

export interface DiscountDTO {
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

export interface DiscountValidationDTO {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  duration: DiscountDuration;
  repeating_count?: number;
  is_active: boolean;
  expires_at?: Date;
  can_be_redeemed: boolean;
}
