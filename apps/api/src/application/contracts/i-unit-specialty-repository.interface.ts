import { UnitSpecialtyEntity } from '@/domain/entities/unit-specialty.entity';

export interface IUnitSpecialtyRepository {
  create(entity: UnitSpecialtyEntity): Promise<UnitSpecialtyEntity>;
  find_by_unit_and_specialty(unit_id: string, specialty_id: string): Promise<UnitSpecialtyEntity | null>;
  list_by_unit(unit_id: string): Promise<UnitSpecialtyEntity[]>;
  delete(unit_id: string, specialty_id: string): Promise<boolean>;
}
