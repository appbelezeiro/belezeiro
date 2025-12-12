import { IBookingRuleRepository } from '@/application/contracts/bookings/i-booking-rule-repository.interface.js';
import { BookingRuleEntity } from '@/domain/entities/bookings/booking-rule.entity.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { BookingRuleDataMapper } from '../data-mappers/index.js';

export class PrismaBookingRuleRepository implements IBookingRuleRepository {
  async create(entity: BookingRuleEntity): Promise<BookingRuleEntity> {
    const data = BookingRuleDataMapper.toPrismaCreate(entity);
    const created = await prisma.bookingRule.create({ data });
    return BookingRuleDataMapper.toDomain(created);
  }

  async update(entity: BookingRuleEntity): Promise<BookingRuleEntity> {
    const data = BookingRuleDataMapper.toPrisma(entity);
    const updated = await prisma.bookingRule.update({
      where: { id: entity.id },
      data,
    });
    return BookingRuleDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.bookingRule.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async find_by_id(id: string): Promise<BookingRuleEntity | null> {
    const found = await prisma.bookingRule.findUnique({ where: { id } });
    return found ? BookingRuleDataMapper.toDomain(found) : null;
  }

  async find_by_user_id(user_id: string): Promise<BookingRuleEntity[]> {
    const rules = await prisma.bookingRule.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
    });
    return rules.map(BookingRuleDataMapper.toDomain);
  }

  async find_by_user_id_and_date(user_id: string, date: string): Promise<BookingRuleEntity[]> {
    const rules = await prisma.bookingRule.findMany({
      where: {
        user_id,
        type: 'specific_date',
        date,
      },
      orderBy: { created_at: 'desc' },
    });
    return rules.map(BookingRuleDataMapper.toDomain);
  }

  async find_weekly_by_weekday(user_id: string, weekday: number): Promise<BookingRuleEntity[]> {
    const rules = await prisma.bookingRule.findMany({
      where: {
        user_id,
        type: 'weekly',
        weekday,
      },
      orderBy: { created_at: 'desc' },
    });
    return rules.map(BookingRuleDataMapper.toDomain);
  }
}
