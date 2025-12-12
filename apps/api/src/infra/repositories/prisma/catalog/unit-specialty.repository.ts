import { IUnitSpecialtyRepository } from '@/application/contracts/i-unit-specialty-repository.interface.js';
import { UnitSpecialtyEntity } from '@/domain/entities/unit-specialty.entity.js';
import { prisma } from '../client/index.js';
import { UnitSpecialtyDataMapper } from '../data-mappers/index.js';

export class PrismaUnitSpecialtyRepository implements IUnitSpecialtyRepository {
  async create(entity: UnitSpecialtyEntity): Promise<UnitSpecialtyEntity> {
    const data = UnitSpecialtyDataMapper.toPrismaCreate(entity);
    const created = await prisma.unitSpecialty.create({ data });
    return UnitSpecialtyDataMapper.toDomain(created);
  }

  async find_by_unit_and_specialty(unit_id: string, specialty_id: string): Promise<UnitSpecialtyEntity | null> {
    const found = await prisma.unitSpecialty.findUnique({
      where: {
        unit_id_specialty_id: { unit_id, specialty_id },
      },
    });
    return found ? UnitSpecialtyDataMapper.toDomain(found) : null;
  }

  async list_by_unit(unit_id: string): Promise<UnitSpecialtyEntity[]> {
    const items = await prisma.unitSpecialty.findMany({
      where: { unit_id },
      orderBy: { created_at: 'desc' },
    });
    return items.map(UnitSpecialtyDataMapper.toDomain);
  }

  async delete(unit_id: string, specialty_id: string): Promise<boolean> {
    try {
      await prisma.unitSpecialty.delete({
        where: {
          unit_id_specialty_id: { unit_id, specialty_id },
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}
