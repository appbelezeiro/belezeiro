import { AmenityEntity } from '@/domain/entities/amenity.entity';
import { CursorPaginatedResponse } from '../types/cursor-pagination.types';

export interface IAmenityRepository {
  create(entity: AmenityEntity): Promise<AmenityEntity>;
  find_by_id(id: string): Promise<AmenityEntity | null>;
  find_by_code(code: string): Promise<AmenityEntity | null>;
  list(cursor?: string, limit?: number): Promise<CursorPaginatedResponse<AmenityEntity>>;
  list_active(cursor?: string, limit?: number): Promise<CursorPaginatedResponse<AmenityEntity>>;
  search(query: string, cursor?: string, limit?: number): Promise<CursorPaginatedResponse<AmenityEntity>>;
  update(entity: AmenityEntity): Promise<AmenityEntity>;
  delete(id: string): Promise<boolean>;
  find_many_by_id(id: string[]): Promise<AmenityEntity[]>;
}
