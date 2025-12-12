import { IAmenityRepository } from '@/application/contracts/i-amenity-repository.interface.js';
import { AmenityEntity } from '@/domain/entities/amenity.entity.js';
import { CursorPaginatedResponse, DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT } from '@/application/types/cursor-pagination.types.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { AmenityDataMapper } from '../data-mappers/index.js';

export class PrismaAmenityRepository implements IAmenityRepository {
  async create(entity: AmenityEntity): Promise<AmenityEntity> {
    const data = AmenityDataMapper.toPrismaCreate(entity);
    const created = await prisma.amenity.create({ data });
    return AmenityDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<AmenityEntity | null> {
    const found = await prisma.amenity.findUnique({ where: { id } });
    return found ? AmenityDataMapper.toDomain(found) : null;
  }

  async find_by_code(code: string): Promise<AmenityEntity | null> {
    const found = await prisma.amenity.findUnique({ where: { code } });
    return found ? AmenityDataMapper.toDomain(found) : null;
  }

  async list(cursor?: string, limit?: number): Promise<CursorPaginatedResponse<AmenityEntity>> {
    const take = Math.min(limit || DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT);

    const amenities = await prisma.amenity.findMany({
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { created_at: 'desc' },
    });

    const has_more = amenities.length > take;
    const items = has_more ? amenities.slice(0, take) : amenities;
    const next_cursor = has_more ? items[items.length - 1]?.id ?? null : null;

    return {
      items: items.map(AmenityDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async list_active(cursor?: string, limit?: number): Promise<CursorPaginatedResponse<AmenityEntity>> {
    const take = Math.min(limit || DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT);

    const amenities = await prisma.amenity.findMany({
      where: { is_active: true },
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { created_at: 'desc' },
    });

    const has_more = amenities.length > take;
    const items = has_more ? amenities.slice(0, take) : amenities;
    const next_cursor = has_more ? items[items.length - 1]?.id ?? null : null;

    return {
      items: items.map(AmenityDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async search(query: string, cursor?: string, limit?: number): Promise<CursorPaginatedResponse<AmenityEntity>> {
    const take = Math.min(limit || DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT);

    const amenities = await prisma.amenity.findMany({
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

    const has_more = amenities.length > take;
    const items = has_more ? amenities.slice(0, take) : amenities;
    const next_cursor = has_more ? items[items.length - 1]?.id ?? null : null;

    return {
      items: items.map(AmenityDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async update(entity: AmenityEntity): Promise<AmenityEntity> {
    const data = AmenityDataMapper.toPrisma(entity);
    const updated = await prisma.amenity.update({
      where: { id: entity.id },
      data,
    });
    return AmenityDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.amenity.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
