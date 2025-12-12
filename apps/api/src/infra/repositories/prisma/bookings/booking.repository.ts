import { IBookingRepository } from '@/application/contracts/bookings/i-booking-repository.interface.js';
import { BookingEntity } from '@/domain/entities/bookings/booking.entity.js';
import { prisma } from '../client/index.js';
import { BookingDataMapper } from '../data-mappers/index.js';

export class PrismaBookingRepository implements IBookingRepository {
  async create(entity: BookingEntity): Promise<BookingEntity> {
    const data = BookingDataMapper.toPrismaCreate(entity);
    const created = await prisma.booking.create({ data });
    return BookingDataMapper.toDomain(created);
  }

  async update(entity: BookingEntity): Promise<BookingEntity> {
    const data = BookingDataMapper.toPrisma(entity);
    const updated = await prisma.booking.update({
      where: { id: entity.id },
      data,
    });
    return BookingDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.booking.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async find_by_id(id: string): Promise<BookingEntity | null> {
    const found = await prisma.booking.findUnique({ where: { id } });
    return found ? BookingDataMapper.toDomain(found) : null;
  }

  async find_by_user_id_and_date_range(
    user_id: string,
    start_date: string,
    end_date: string,
  ): Promise<BookingEntity[]> {
    const startOfDay = new Date(start_date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(end_date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        user_id,
        start_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { start_at: 'asc' },
    });

    return bookings.map(BookingDataMapper.toDomain);
  }

  async find_overlapping(user_id: string, start_at: string, end_at: string): Promise<BookingEntity[]> {
    const startTime = new Date(start_at);
    const endTime = new Date(end_at);

    const bookings = await prisma.booking.findMany({
      where: {
        user_id,
        status: 'confirmed',
        AND: [
          { start_at: { lt: endTime } },
          { end_at: { gt: startTime } },
        ],
      },
      orderBy: { start_at: 'asc' },
    });

    return bookings.map(BookingDataMapper.toDomain);
  }

  async count_by_user_and_date(user_id: string, date: string): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.booking.count({
      where: {
        user_id,
        status: 'confirmed',
        start_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async count_by_client_and_user_and_date(
    client_id: string,
    user_id: string,
    date: string,
  ): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.booking.count({
      where: {
        client_id,
        user_id,
        status: 'confirmed',
        start_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }
}
