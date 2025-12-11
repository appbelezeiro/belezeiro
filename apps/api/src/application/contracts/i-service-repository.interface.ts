import { ServiceEntity } from '@/domain/entities/service.entity';
import { CursorPaginatedResponse } from '../types/cursor-pagination.types';

export interface IServiceRepository {
  create(entity: ServiceEntity): Promise<ServiceEntity>;
  find_by_id(id: string): Promise<ServiceEntity | null>;
  find_by_code(code: string): Promise<ServiceEntity | null>;
  list(specialty_id?: string, cursor?: string, limit?: number): Promise<CursorPaginatedResponse<ServiceEntity>>;
  search(query: string, specialty_id?: string, cursor?: string, limit?: number): Promise<CursorPaginatedResponse<ServiceEntity>>;
  update(entity: ServiceEntity): Promise<ServiceEntity>;
  delete(id: string): Promise<boolean>;
  list_by_specialty_id(specialty_id: string): Promise<ServiceEntity[]>;
}
