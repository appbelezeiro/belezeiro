import { IDiscountRepository } from '@/application/contracts/billing/i-discount-repository.interface.js';
import { DiscountEntity } from '@/domain/entities/billing/discount.entity.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { DiscountDataMapper } from '../data-mappers/index.js';

export class PrismaDiscountRepository implements IDiscountRepository {
  async create(entity: DiscountEntity): Promise<DiscountEntity> {
    const data = DiscountDataMapper.toPrismaCreate(entity);
    const created = await prisma.discount.create({ data });
    return DiscountDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<DiscountEntity | null> {
    const found = await prisma.discount.findUnique({ where: { id } });
    return found ? DiscountDataMapper.toDomain(found) : null;
  }

  async find_by_code(code: string): Promise<DiscountEntity | null> {
    const found = await prisma.discount.findUnique({ where: { code } });
    return found ? DiscountDataMapper.toDomain(found) : null;
  }

  async list_active(): Promise<DiscountEntity[]> {
    const now = new Date();
    const discounts = await prisma.discount.findMany({
      where: {
        is_active: true,
        OR: [
          { expires_at: null },
          { expires_at: { gt: now } },
        ],
      },
      orderBy: { created_at: 'desc' },
    });
    return discounts.map(DiscountDataMapper.toDomain);
  }

  async list_all(): Promise<DiscountEntity[]> {
    const discounts = await prisma.discount.findMany({
      orderBy: { created_at: 'desc' },
    });
    return discounts.map(DiscountDataMapper.toDomain);
  }

  async update(entity: DiscountEntity): Promise<DiscountEntity> {
    const data = DiscountDataMapper.toPrisma(entity);
    const updated = await prisma.discount.update({
      where: { id: entity.id },
      data,
    });
    return DiscountDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.discount.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
