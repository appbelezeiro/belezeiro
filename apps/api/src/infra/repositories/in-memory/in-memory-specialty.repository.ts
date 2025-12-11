import { SpecialtyEntity } from '@/domain/entities/specialty.entity';
import { ISpecialtyRepository } from '@/application/contracts/i-specialty-repository.interface';
import {
  SpecialtyDataMapper,
  SpecialtyPersistence,
} from './data-mappers/specialty.data-mapper';
import {
  CursorPaginatedResponse,
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT,
} from '@/application/types/cursor-pagination.types';
import { encodeCursor, decodeCursor } from '@/application/utils/cursor.util';

export class InMemorySpecialtyRepository implements ISpecialtyRepository {
  private items: SpecialtyPersistence[] = [];

  async create(entity: SpecialtyEntity): Promise<SpecialtyEntity> {
    const persistence = SpecialtyDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return SpecialtyDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<SpecialtyEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? SpecialtyDataMapper.toDomain(item) : null;
  }

  async find_by_code(code: string): Promise<SpecialtyEntity | null> {
    const item = this.items.find((i) => i.code === code);
    return item ? SpecialtyDataMapper.toDomain(item) : null;
  }

  async list(
    cursor?: string,
    limit: number = DEFAULT_PAGINATION_LIMIT
  ): Promise<CursorPaginatedResponse<SpecialtyEntity>> {
    const validLimit = Math.min(limit, MAX_PAGINATION_LIMIT);

    let filtered = [...this.items].sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime()
    );

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
      items: results.map(SpecialtyDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async search(
    query: string,
    cursor?: string,
    limit: number = DEFAULT_PAGINATION_LIMIT
  ): Promise<CursorPaginatedResponse<SpecialtyEntity>> {
    const validLimit = Math.min(limit, MAX_PAGINATION_LIMIT);
    const lowerQuery = query.toLowerCase();

    let filtered = this.items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

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
      items: results.map(SpecialtyDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async update(entity: SpecialtyEntity): Promise<SpecialtyEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`Specialty with id ${entity.id} not found`);
    }

    const persistence = SpecialtyDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return SpecialtyDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
