import { CouponRedemption as PrismaCouponRedemption } from '@prisma/client';
import { CouponRedemptionEntity } from '@/domain/entities/billing/coupon-redemption.entity.js';

export class CouponRedemptionDataMapper {
  static toDomain(raw: PrismaCouponRedemption): CouponRedemptionEntity {
    return new CouponRedemptionEntity({
      id: raw.id,
      coupon_id: raw.coupon_id,
      user_id: raw.user_id,
      subscription_id: raw.subscription_id,
      redeemed_at: raw.redeemed_at,
      metadata: raw.metadata as Record<string, any> | undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: CouponRedemptionEntity): Omit<PrismaCouponRedemption, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      coupon_id: entity.coupon_id,
      user_id: entity.user_id,
      subscription_id: entity.subscription_id,
      redeemed_at: entity.redeemed_at,
      metadata: entity.metadata ?? null,
    };
  }

  static toPrismaCreate(entity: CouponRedemptionEntity): Omit<PrismaCouponRedemption, 'updated_at'> {
    return {
      ...CouponRedemptionDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    };
  }
}
