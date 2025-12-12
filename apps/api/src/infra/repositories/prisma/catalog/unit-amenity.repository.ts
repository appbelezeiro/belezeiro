import { IUnitAmenityRepository } from '@/application/contracts/i-unit-amenity-repository.interface.js';
import { UnitAmenityEntity } from '@/domain/entities/unit-amenity.entity.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { UnitAmenityDataMapper } from '../data-mappers/index.js';

export class PrismaUnitAmenityRepository implements IUnitAmenityRepository {
  async create(entity: UnitAmenityEntity): Promise<UnitAmenityEntity> {
    const data = UnitAmenityDataMapper.toPrismaCreate(entity);
    const created = await prisma.unitAmenity.create({ data });
    return UnitAmenityDataMapper.toDomain(created);
  }

  async find_by_unit_and_amenity(unit_id: string, amenity_id: string): Promise<UnitAmenityEntity | null> {
    const found = await prisma.unitAmenity.findUnique({
      where: {
        unit_id_amenity_id: { unit_id, amenity_id },
      },
    });
    return found ? UnitAmenityDataMapper.toDomain(found) : null;
  }

  async list_by_unit(unit_id: string): Promise<UnitAmenityEntity[]> {
    const items = await prisma.unitAmenity.findMany({
      where: { unit_id },
      orderBy: { created_at: 'desc' },
    });
    return items.map(UnitAmenityDataMapper.toDomain);
  }

  async delete(unit_id: string, amenity_id: string): Promise<boolean> {
    try {
      await prisma.unitAmenity.delete({
        where: {
          unit_id_amenity_id: { unit_id, amenity_id },
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}
