import { UnitServiceEntity } from '@/domain/entities/unit-service.entity';
import { IUnitServiceRepository } from '@/application/contracts/i-unit-service-repository.interface';
import {
  UnitServiceDataMapper,
  UnitServicePersistence,
} from './data-mappers/unit-service.data-mapper';
import {
  CursorPaginatedResponse,
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT,
} from '@/application/types/cursor-pagination.types';
import { encodeCursor, decodeCursor } from '@/application/utils/cursor.util';

export class InMemoryUnitServiceRepository implements IUnitServiceRepository {
  private items: UnitServicePersistence[] = [];

  async create(entity: UnitServiceEntity): Promise<UnitServiceEntity> {
    const persistence = UnitServiceDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return UnitServiceDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<UnitServiceEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? UnitServiceDataMapper.toDomain(item) : null;
  }

  async find_by_unit_and_service(
    unit_id: string,
    service_id: string
  ): Promise<UnitServiceEntity | null> {
    const item = this.items.find((i) => i.unit_id === unit_id && i.service_id === service_id);
    return item ? UnitServiceDataMapper.toDomain(item) : null;
  }

  async list_by_unit(
    unit_id: string,
    cursor?: string,
    limit: number = DEFAULT_PAGINATION_LIMIT
  ): Promise<CursorPaginatedResponse<UnitServiceEntity>> {
    const validLimit = Math.min(limit, MAX_PAGINATION_LIMIT);

    let filtered = this.items
      .filter((i) => i.unit_id === unit_id)
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
      items: results.map(UnitServiceDataMapper.toDomain),
      next_cursor,
      has_more,
    };
  }

  async update(entity: UnitServiceEntity): Promise<UnitServiceEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`UnitService with id ${entity.id} not found`);
    }

    const persistence = UnitServiceDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return UnitServiceDataMapper.toDomain(persistence);
  }

  async delete(unit_id: string, service_id: string): Promise<boolean> {
    const index = this.items.findIndex(
      (i) => i.unit_id === unit_id && i.service_id === service_id
    );
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
