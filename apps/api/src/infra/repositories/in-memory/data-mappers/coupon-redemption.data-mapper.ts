import { CouponRedemptionEntity } from '@/domain/entities/coupon-redemption.entity';

export interface CouponRedemptionPersistence {
  id: string;
  coupon_id: string;
  user_id: string;
  subscription_id: string;
  redeemed_at: Date;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export class CouponRedemptionDataMapper {
  static toDomain(raw: CouponRedemptionPersistence): CouponRedemptionEntity {
    return new CouponRedemptionEntity({
      id: raw.id,
      coupon_id: raw.coupon_id,
      user_id: raw.user_id,
      subscription_id: raw.subscription_id,
      redeemed_at: raw.redeemed_at,
      metadata: raw.metadata,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: CouponRedemptionEntity): CouponRedemptionPersistence {
    return {
      id: entity.id,
      coupon_id: entity.coupon_id,
      user_id: entity.user_id,
      subscription_id: entity.subscription_id,
      redeemed_at: entity.redeemed_at,
      metadata: entity.metadata,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
