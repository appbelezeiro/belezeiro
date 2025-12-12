import { IUnitAvailabilityExceptionRepository } from '@/application/contracts/units/i-unit-availability-exception-repository.interface.js';
import { UnitAvailabilityExceptionEntity } from '@/domain/entities/units/unit-availability-exception.entity.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { UnitAvailabilityExceptionDataMapper } from '../data-mappers/index.js';

export class PrismaUnitAvailabilityExceptionRepository implements IUnitAvailabilityExceptionRepository {
  async create(exception: UnitAvailabilityExceptionEntity): Promise<UnitAvailabilityExceptionEntity> {
    const data = UnitAvailabilityExceptionDataMapper.toPrismaCreate(exception);
    const created = await prisma.unitAvailabilityException.create({ data });
    return UnitAvailabilityExceptionDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<UnitAvailabilityExceptionEntity | null> {
    const found = await prisma.unitAvailabilityException.findUnique({ where: { id } });
    return found ? UnitAvailabilityExceptionDataMapper.toDomain(found) : null;
  }

  async find_by_unit_id(unit_id: string): Promise<UnitAvailabilityExceptionEntity[]> {
    const exceptions = await prisma.unitAvailabilityException.findMany({
      where: { unit_id },
      orderBy: { date: 'desc' },
    });
    return exceptions.map(UnitAvailabilityExceptionDataMapper.toDomain);
  }

  async find_by_unit_id_and_date(
    unit_id: string,
    date: string,
  ): Promise<UnitAvailabilityExceptionEntity | null> {
    const found = await prisma.unitAvailabilityException.findFirst({
      where: { unit_id, date },
    });
    return found ? UnitAvailabilityExceptionDataMapper.toDomain(found) : null;
  }

  async find_by_unit_id_and_date_range(
    unit_id: string,
    start_date: string,
    end_date: string,
  ): Promise<UnitAvailabilityExceptionEntity[]> {
    const exceptions = await prisma.unitAvailabilityException.findMany({
      where: {
        unit_id,
        date: {
          gte: start_date,
          lte: end_date,
        },
      },
      orderBy: { date: 'asc' },
    });
    return exceptions.map(UnitAvailabilityExceptionDataMapper.toDomain);
  }

  async update(exception: UnitAvailabilityExceptionEntity): Promise<UnitAvailabilityExceptionEntity> {
    const data = UnitAvailabilityExceptionDataMapper.toPrisma(exception);
    const updated = await prisma.unitAvailabilityException.update({
      where: { id: exception.id },
      data,
    });
    return UnitAvailabilityExceptionDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.unitAvailabilityException.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async delete_all_by_unit_id(unit_id: string): Promise<number> {
    const result = await prisma.unitAvailabilityException.deleteMany({
      where: { unit_id },
    });
    return result.count;
  }
}
