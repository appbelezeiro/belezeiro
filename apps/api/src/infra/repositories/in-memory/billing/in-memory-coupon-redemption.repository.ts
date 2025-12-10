import { CouponRedemptionEntity } from '@/domain/entities/billing/coupon-redemption.entity';
import { ICouponRedemptionRepository } from '@/application/contracts/billing/i-coupon-redemption-repository.interface';
import { CouponRedemptionDataMapper, CouponRedemptionPersistence } from '../data-mappers/billing/coupon-redemption.data-mapper';

export class InMemoryCouponRedemptionRepository implements ICouponRedemptionRepository {
  private items: CouponRedemptionPersistence[] = [];

  async create(entity: CouponRedemptionEntity): Promise<CouponRedemptionEntity> {
    const persistence = CouponRedemptionDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return CouponRedemptionDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<CouponRedemptionEntity | null> {
    const item = this.items.find((c) => c.id === id);
    return item ? CouponRedemptionDataMapper.toDomain(item) : null;
  }

  async find_by_user_and_coupon(
    user_id: string,
    coupon_id: string,
  ): Promise<CouponRedemptionEntity | null> {
    const item = this.items.find(
      (c) => c.user_id === user_id && c.coupon_id === coupon_id,
    );
    return item ? CouponRedemptionDataMapper.toDomain(item) : null;
  }

  async list_by_user(user_id: string): Promise<CouponRedemptionEntity[]> {
    return this.items
      .filter((c) => c.user_id === user_id)
      .map(CouponRedemptionDataMapper.toDomain);
  }

  async list_by_coupon(coupon_id: string): Promise<CouponRedemptionEntity[]> {
    return this.items
      .filter((c) => c.coupon_id === coupon_id)
      .map(CouponRedemptionDataMapper.toDomain);
  }

  async list_all(): Promise<CouponRedemptionEntity[]> {
    return this.items.map(CouponRedemptionDataMapper.toDomain);
  }
}
