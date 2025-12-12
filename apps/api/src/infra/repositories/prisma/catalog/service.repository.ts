import { IServiceRepository } from '@/application/contracts/i-service-repository.interface.js';
import { ServiceEntity } from '@/domain/entities/service.entity.js';
import { CursorPaginatedResponse, DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT } from '@/application/types/cursor-pagination.types.js';
import { prisma } from '../client/index.js';
import { ServiceDataMapper } from '../data-mappers/index.js';

export class PrismaServiceRepository implements IServiceRepository {
  async create(entity: ServiceEntity): Promise<ServiceEntity> {
    const data = ServiceDataMapper.toPrismaCreate(entity);
    const created = await prisma.service.create({ data });
    return ServiceDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<ServiceEntity | null> {
    const found = await prisma.service.findUnique({ where: { id } });
    return found ? ServiceDataMapper.toDomain(found) : null;
  }

  async find_by_code(code: string): Promise<ServiceEntity | null> {
    const found = await prisma.service.findUnique({ where: { code } });
    return found ? ServiceDataMapper.toDomain(found) : null;
  }

  async list(specialty_id?: string, cursor?: string, limit?: number): Promise<CursorPaginatedResponse<ServiceEntity>> {
    const take = Math.min(limit || DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT);

    const services = await prisma.service.findMany({
      where: specialty_id ? { specialty_id } : undefined,
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { created_at: 'desc' },
    });

    const has_more = services.length > take;
    const items = has_more ? services.slice(0, take) : services;
    const next_cursor = has_more ? items[items.length - 1]?.id ?? null : null;

    return {
      items: items.map(ServiceDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async search(query: string, specialty_id?: string, cursor?: string, limit?: number): Promise<CursorPaginatedResponse<ServiceEntity>> {
    const take = Math.min(limit || DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT);

    const services = await prisma.service.findMany({
      where: {
        AND: [
          specialty_id ? { specialty_id } : {},
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { code: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { created_at: 'desc' },
    });

    const has_more = services.length > take;
    const items = has_more ? services.slice(0, take) : services;
    const next_cursor = has_more ? items[items.length - 1]?.id ?? null : null;

    return {
      items: items.map(ServiceDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async update(entity: ServiceEntity): Promise<ServiceEntity> {
    const data = ServiceDataMapper.toPrisma(entity);
    const updated = await prisma.service.update({
      where: { id: entity.id },
      data,
    });
    return ServiceDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.service.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async list_by_specialty_id(specialty_id: string): Promise<ServiceEntity[]> {
    const services = await prisma.service.findMany({
      where: { specialty_id },
      orderBy: { created_at: 'desc' },
    });
    return services.map(ServiceDataMapper.toDomain);
  }
}
