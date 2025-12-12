import { IUnitServiceRepository } from '@/application/contracts/i-unit-service-repository.interface.js';
import { UnitServiceEntity } from '@/domain/entities/unit-service.entity.js';
import { CursorPaginatedResponse, DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT } from '@/application/types/cursor-pagination.types.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { UnitServiceDataMapper } from '../data-mappers/index.js';

export class PrismaUnitServiceRepository implements IUnitServiceRepository {
  async create(entity: UnitServiceEntity): Promise<UnitServiceEntity> {
    const data = UnitServiceDataMapper.toPrismaCreate(entity);
    const created = await prisma.unitService.create({ data });
    return UnitServiceDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<UnitServiceEntity | null> {
    const found = await prisma.unitService.findUnique({ where: { id } });
    return found ? UnitServiceDataMapper.toDomain(found) : null;
  }

  async find_by_unit_and_service(unit_id: string, service_id: string): Promise<UnitServiceEntity | null> {
    const found = await prisma.unitService.findUnique({
      where: {
        unit_id_service_id: { unit_id, service_id },
      },
    });
    return found ? UnitServiceDataMapper.toDomain(found) : null;
  }

  async list_by_unit(unit_id: string, cursor?: string, limit?: number): Promise<CursorPaginatedResponse<UnitServiceEntity>> {
    const take = Math.min(limit || DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT);

    const items = await prisma.unitService.findMany({
      where: { unit_id },
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { created_at: 'desc' },
    });

    const has_more = items.length > take;
    const result = has_more ? items.slice(0, take) : items;
    const next_cursor = has_more ? result[result.length - 1]?.id ?? null : null;

    return {
      items: result.map(UnitServiceDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async update(entity: UnitServiceEntity): Promise<UnitServiceEntity> {
    const data = UnitServiceDataMapper.toPrisma(entity);
    const updated = await prisma.unitService.update({
      where: { id: entity.id },
      data,
    });
    return UnitServiceDataMapper.toDomain(updated);
  }

  async delete(unit_id: string, service_id: string): Promise<boolean> {
    try {
      await prisma.unitService.delete({
        where: {
          unit_id_service_id: { unit_id, service_id },
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}
