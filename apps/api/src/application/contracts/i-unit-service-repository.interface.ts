import { UnitServiceEntity } from '@/domain/entities/unit-service.entity';
import { CursorPaginatedResponse } from '../types/cursor-pagination.types';

export interface IUnitServiceRepository {
  create(entity: UnitServiceEntity): Promise<UnitServiceEntity>;
  find_by_id(id: string): Promise<UnitServiceEntity | null>;
  find_by_unit_and_service(unit_id: string, service_id: string): Promise<UnitServiceEntity | null>;
  list_by_unit(unit_id: string, cursor?: string, limit?: number): Promise<CursorPaginatedResponse<UnitServiceEntity>>;
  update(entity: UnitServiceEntity): Promise<UnitServiceEntity>;
  delete(unit_id: string, service_id: string): Promise<boolean>;
}
