import { ICouponRedemptionRepository } from '@/application/contracts/billing/i-coupon-redemption-repository.interface.js';
import { CouponRedemptionEntity } from '@/domain/entities/billing/coupon-redemption.entity.js';
import { prisma } from '../client/index.js';
import { CouponRedemptionDataMapper } from '../data-mappers/index.js';

export class PrismaCouponRedemptionRepository implements ICouponRedemptionRepository {
  async create(entity: CouponRedemptionEntity): Promise<CouponRedemptionEntity> {
    const data = CouponRedemptionDataMapper.toPrismaCreate(entity);
    const created = await prisma.couponRedemption.create({ data });
    return CouponRedemptionDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<CouponRedemptionEntity | null> {
    const found = await prisma.couponRedemption.findUnique({ where: { id } });
    return found ? CouponRedemptionDataMapper.toDomain(found) : null;
  }

  async find_by_user_and_coupon(
    user_id: string,
    coupon_id: string,
  ): Promise<CouponRedemptionEntity | null> {
    const found = await prisma.couponRedemption.findFirst({
      where: { user_id, coupon_id },
    });
    return found ? CouponRedemptionDataMapper.toDomain(found) : null;
  }

  async list_by_user(user_id: string): Promise<CouponRedemptionEntity[]> {
    const redemptions = await prisma.couponRedemption.findMany({
      where: { user_id },
      orderBy: { redeemed_at: 'desc' },
    });
    return redemptions.map(CouponRedemptionDataMapper.toDomain);
  }

  async list_by_coupon(coupon_id: string): Promise<CouponRedemptionEntity[]> {
    const redemptions = await prisma.couponRedemption.findMany({
      where: { coupon_id },
      orderBy: { redeemed_at: 'desc' },
    });
    return redemptions.map(CouponRedemptionDataMapper.toDomain);
  }

  async list_all(): Promise<CouponRedemptionEntity[]> {
    const redemptions = await prisma.couponRedemption.findMany({
      orderBy: { redeemed_at: 'desc' },
    });
    return redemptions.map(CouponRedemptionDataMapper.toDomain);
  }
}
