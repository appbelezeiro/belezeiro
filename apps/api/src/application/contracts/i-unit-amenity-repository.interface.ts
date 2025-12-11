import { UnitAmenityEntity } from '@/domain/entities/unit-amenity.entity';

export interface IUnitAmenityRepository {
  create(entity: UnitAmenityEntity): Promise<UnitAmenityEntity>;
  find_by_unit_and_amenity(unit_id: string, amenity_id: string): Promise<UnitAmenityEntity | null>;
  list_by_unit(unit_id: string): Promise<UnitAmenityEntity[]>;
  delete(unit_id: string, amenity_id: string): Promise<boolean>;
}
