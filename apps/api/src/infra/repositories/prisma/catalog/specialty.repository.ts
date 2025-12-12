import { ISpecialtyRepository } from '@/application/contracts/i-specialty-repository.interface.js';
import { SpecialtyEntity } from '@/domain/entities/specialty.entity.js';
import { CursorPaginatedResponse, DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT } from '@/application/types/cursor-pagination.types.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { SpecialtyDataMapper } from '../data-mappers/index.js';

export class PrismaSpecialtyRepository implements ISpecialtyRepository {
  async create(entity: SpecialtyEntity): Promise<SpecialtyEntity> {
    const data = SpecialtyDataMapper.toPrismaCreate(entity);
    const created = await prisma.specialty.create({ data });
    return SpecialtyDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<SpecialtyEntity | null> {
    const found = await prisma.specialty.findUnique({ where: { id } });
    return found ? SpecialtyDataMapper.toDomain(found) : null;
  }

  async find_by_code(code: string): Promise<SpecialtyEntity | null> {
    const found = await prisma.specialty.findUnique({ where: { code } });
    return found ? SpecialtyDataMapper.toDomain(found) : null;
  }

  async list(cursor?: string, limit?: number): Promise<CursorPaginatedResponse<SpecialtyEntity>> {
    const take = Math.min(limit || DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT);

    const specialties = await prisma.specialty.findMany({
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { created_at: 'desc' },
    });

    const has_more = specialties.length > take;
    const items = has_more ? specialties.slice(0, take) : specialties;
    const next_cursor = has_more ? items[items.length - 1]?.id ?? null : null;

    return {
      items: items.map(SpecialtyDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async search(query: string, cursor?: string, limit?: number): Promise<CursorPaginatedResponse<SpecialtyEntity>> {
    const take = Math.min(limit || DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT);

    const specialties = await prisma.specialty.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { created_at: 'desc' },
    });

    const has_more = specialties.length > take;
    const items = has_more ? specialties.slice(0, take) : specialties;
    const next_cursor = has_more ? items[items.length - 1]?.id ?? null : null;

    return {
      items: items.map(SpecialtyDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async update(entity: SpecialtyEntity): Promise<SpecialtyEntity> {
    const data = SpecialtyDataMapper.toPrisma(entity);
    const updated = await prisma.specialty.update({
      where: { id: entity.id },
      data,
    });
    return SpecialtyDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.specialty.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async find_many_by_id(ids: string[]): Promise<SpecialtyEntity[]> {
    const specialties = await prisma.specialty.findMany({
      where: { id: { in: ids } },
    });
    return specialties.map(SpecialtyDataMapper.toDomain);
  }
}
