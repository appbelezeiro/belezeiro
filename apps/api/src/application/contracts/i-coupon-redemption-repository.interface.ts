import { CouponRedemptionEntity } from '@/domain/entities/coupon-redemption.entity';

export interface ICouponRedemptionRepository {
  create(entity: CouponRedemptionEntity): Promise<CouponRedemptionEntity>;
  find_by_id(id: string): Promise<CouponRedemptionEntity | null>;
  find_by_user_and_coupon(
    user_id: string,
    coupon_id: string,
  ): Promise<CouponRedemptionEntity | null>;
  list_by_user(user_id: string): Promise<CouponRedemptionEntity[]>;
  list_by_coupon(coupon_id: string): Promise<CouponRedemptionEntity[]>;
  list_all(): Promise<CouponRedemptionEntity[]>;
}
