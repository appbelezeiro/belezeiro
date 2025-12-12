import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface.js';
import { UnitEntity } from '@/domain/entities/units/unit.entity.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { UnitDataMapper } from '../data-mappers/index.js';

export class PrismaUnitRepository implements IUnitRepository {
  async create(entity: UnitEntity): Promise<UnitEntity> {
    const data = UnitDataMapper.toPrismaCreate(entity);
    const created = await prisma.unit.create({ data });
    return UnitDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<UnitEntity | null> {
    const found = await prisma.unit.findUnique({ where: { id } });
    return found ? UnitDataMapper.toDomain(found) : null;
  }

  async find_by_organization_id(organizationId: string): Promise<UnitEntity[]> {
    const units = await prisma.unit.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
    });
    return units.map(UnitDataMapper.toDomain);
  }

  async list_all(): Promise<UnitEntity[]> {
    const units = await prisma.unit.findMany({
      orderBy: { created_at: 'desc' },
    });
    return units.map(UnitDataMapper.toDomain);
  }

  async list_active(): Promise<UnitEntity[]> {
    const units = await prisma.unit.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' },
    });
    return units.map(UnitDataMapper.toDomain);
  }

  async update(entity: UnitEntity): Promise<UnitEntity> {
    const data = UnitDataMapper.toPrisma(entity);
    const updated = await prisma.unit.update({
      where: { id: entity.id },
      data,
    });
    return UnitDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.unit.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
