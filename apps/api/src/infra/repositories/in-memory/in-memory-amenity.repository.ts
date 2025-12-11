import { AmenityEntity } from '@/domain/entities/amenity.entity';
import { IAmenityRepository } from '@/application/contracts/i-amenity-repository.interface';
import {
  AmenityDataMapper,
  AmenityPersistence,
} from './data-mappers/amenity.data-mapper';
import {
  CursorPaginatedResponse,
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT,
} from '@/application/types/cursor-pagination.types';
import { encodeCursor, decodeCursor } from '@/application/utils/cursor.util';
import { fuzzySearchMatch } from '@/application/utils/fuzzy-search.util';

export class InMemoryAmenityRepository implements IAmenityRepository {
  private items: AmenityPersistence[] = [];

  async create(entity: AmenityEntity): Promise<AmenityEntity> {
    const persistence = AmenityDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return AmenityDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<AmenityEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? AmenityDataMapper.toDomain(item) : null;
  }

  async find_by_code(code: string): Promise<AmenityEntity | null> {
    const item = this.items.find((i) => i.code === code);
    return item ? AmenityDataMapper.toDomain(item) : null;
  }

  async list(
    cursor?: string,
    limit: number = DEFAULT_PAGINATION_LIMIT
  ): Promise<CursorPaginatedResponse<AmenityEntity>> {
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
      items: results.map(AmenityDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async list_active(
    cursor?: string,
    limit: number = DEFAULT_PAGINATION_LIMIT
  ): Promise<CursorPaginatedResponse<AmenityEntity>> {
    const validLimit = Math.min(limit, MAX_PAGINATION_LIMIT);

    let filtered = this.items
      .filter((item) => item.is_active)
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
      items: results.map(AmenityDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async search(
    query: string,
    cursor?: string,
    limit: number = DEFAULT_PAGINATION_LIMIT
  ): Promise<CursorPaginatedResponse<AmenityEntity>> {
    const validLimit = Math.min(limit, MAX_PAGINATION_LIMIT);

    // Use fuzzy search to find matches with scores
    const itemsWithScores = this.items
      .map((item) => {
        const result = fuzzySearchMatch(query, item.name, item.description);
        return { item, ...result };
      })
      .filter((entry) => entry.matches)
      // Sort by score (best matches first), then by created_at
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return b.item.created_at.getTime() - a.item.created_at.getTime();
      });

    let filtered = itemsWithScores.map((entry) => entry.item);

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
      items: results.map(AmenityDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async update(entity: AmenityEntity): Promise<AmenityEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`Amenity with id ${entity.id} not found`);
    }

    const persistence = AmenityDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return AmenityDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
