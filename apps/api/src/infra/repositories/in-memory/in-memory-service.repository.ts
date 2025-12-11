import { ServiceEntity } from '@/domain/entities/service.entity';
import { IServiceRepository } from '@/application/contracts/i-service-repository.interface';
import { ServiceDataMapper, ServicePersistence } from './data-mappers/service.data-mapper';
import {
  CursorPaginatedResponse,
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT,
} from '@/application/types/cursor-pagination.types';
import { encodeCursor, decodeCursor } from '@/application/utils/cursor.util';

export class InMemoryServiceRepository implements IServiceRepository {
  private items: ServicePersistence[] = [];

  async create(entity: ServiceEntity): Promise<ServiceEntity> {
    const persistence = ServiceDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return ServiceDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<ServiceEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? ServiceDataMapper.toDomain(item) : null;
  }

  async find_by_code(code: string): Promise<ServiceEntity | null> {
    const item = this.items.find((i) => i.code === code);
    return item ? ServiceDataMapper.toDomain(item) : null;
  }

  async list(
    specialty_id?: string,
    cursor?: string,
    limit: number = DEFAULT_PAGINATION_LIMIT
  ): Promise<CursorPaginatedResponse<ServiceEntity>> {
    const validLimit = Math.min(limit, MAX_PAGINATION_LIMIT);

    let filtered = [...this.items];
    if (specialty_id) {
      filtered = filtered.filter((i) => i.specialty_id === specialty_id);
    }

    filtered.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    if (cursor) {
      const decoded = decodeCursor(cursor);
      filtered = filtered.filter((item) => {
        return (
          item.created_at < decoded.created_at ||
          (item.created_at.getTime() === decoded.created_at.getTime() && item.id < decoded.id)
        );
      });
    }

    const items = filtered.slice(0, validLimit + 1);
    const has_more = items.length > validLimit;
    const results = has_more ? items.slice(0, validLimit) : items;
    const next_cursor =
      has_more && results.length > 0
        ? encodeCursor(results[results.length - 1].created_at, results[results.length - 1].id)
        : null;

    return {
      items: results.map(ServiceDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async search(
    query: string,
    specialty_id?: string,
    cursor?: string,
    limit: number = DEFAULT_PAGINATION_LIMIT
  ): Promise<CursorPaginatedResponse<ServiceEntity>> {
    const validLimit = Math.min(limit, MAX_PAGINATION_LIMIT);
    const lowerQuery = query.toLowerCase();

    let filtered = this.items.filter((item) => {
      const matchesQuery =
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery);
      const matchesSpecialty = specialty_id ? item.specialty_id === specialty_id : true;
      return matchesQuery && matchesSpecialty;
    });

    filtered.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    if (cursor) {
      const decoded = decodeCursor(cursor);
      filtered = filtered.filter((item) => {
        return (
          item.created_at < decoded.created_at ||
          (item.created_at.getTime() === decoded.created_at.getTime() && item.id < decoded.id)
        );
      });
    }

    const items = filtered.slice(0, validLimit + 1);
    const has_more = items.length > validLimit;
    const results = has_more ? items.slice(0, validLimit) : items;
    const next_cursor =
      has_more && results.length > 0
        ? encodeCursor(results[results.length - 1].created_at, results[results.length - 1].id)
        : null;

    return {
      items: results.map(ServiceDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async update(entity: ServiceEntity): Promise<ServiceEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`Service with id ${entity.id} not found`);
    }

    const persistence = ServiceDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return ServiceDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  async list_by_specialty_id(specialty_id: string): Promise<ServiceEntity[]> {
    return this.items
      .filter((i) => i.specialty_id === specialty_id)
      .map(ServiceDataMapper.toDomain);
  }
}
