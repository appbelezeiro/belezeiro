import { IBookingExceptionRepository } from '@/application/contracts/bookings/i-booking-exception-repository.interface.js';
import { BookingExceptionEntity } from '@/domain/entities/bookings/booking-exception.entity.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { BookingExceptionDataMapper } from '../data-mappers/index.js';

export class PrismaBookingExceptionRepository implements IBookingExceptionRepository {
  async create(entity: BookingExceptionEntity): Promise<BookingExceptionEntity> {
    const data = BookingExceptionDataMapper.toPrismaCreate(entity);
    const created = await prisma.bookingException.create({ data });
    return BookingExceptionDataMapper.toDomain(created);
  }

  async update(entity: BookingExceptionEntity): Promise<BookingExceptionEntity> {
    const data = BookingExceptionDataMapper.toPrisma(entity);
    const updated = await prisma.bookingException.update({
      where: { id: entity.id },
      data,
    });
    return BookingExceptionDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.bookingException.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async find_by_id(id: string): Promise<BookingExceptionEntity | null> {
    const found = await prisma.bookingException.findUnique({ where: { id } });
    return found ? BookingExceptionDataMapper.toDomain(found) : null;
  }

  async find_by_user_id(user_id: string): Promise<BookingExceptionEntity[]> {
    const exceptions = await prisma.bookingException.findMany({
      where: { user_id },
      orderBy: { date: 'desc' },
    });
    return exceptions.map(BookingExceptionDataMapper.toDomain);
  }

  async find_by_user_id_and_date(user_id: string, date: string): Promise<BookingExceptionEntity | null> {
    const found = await prisma.bookingException.findFirst({
      where: { user_id, date },
    });
    return found ? BookingExceptionDataMapper.toDomain(found) : null;
  }
}
