import { SpecialtyEntity } from '@/domain/entities/specialty.entity';
import { CursorPaginatedResponse } from '../types/cursor-pagination.types';

export interface ISpecialtyRepository {
  create(entity: SpecialtyEntity): Promise<SpecialtyEntity>;
  find_by_id(id: string): Promise<SpecialtyEntity | null>;
  find_by_code(code: string): Promise<SpecialtyEntity | null>;
  list(params: ISpecialtyRepository.ListParams): Promise<CursorPaginatedResponse<SpecialtyEntity>>;
  update(entity: SpecialtyEntity): Promise<SpecialtyEntity>;
  delete(id: string): Promise<boolean>;
  find_many_by_id(id: string[]): Promise<SpecialtyEntity[]>;
}

export declare namespace ISpecialtyRepository {
  export type ListParams = {
    cursor?: string;
    limit?: number;
    query?: string;
  }
}