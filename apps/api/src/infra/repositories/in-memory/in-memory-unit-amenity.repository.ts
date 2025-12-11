import { UnitAmenityEntity } from '@/domain/entities/unit-amenity.entity';
import { IUnitAmenityRepository } from '@/application/contracts/i-unit-amenity-repository.interface';
import {
  UnitAmenityDataMapper,
  UnitAmenityPersistence,
} from './data-mappers/unit-amenity.data-mapper';

export class InMemoryUnitAmenityRepository implements IUnitAmenityRepository {
  private items: UnitAmenityPersistence[] = [];

  async create(entity: UnitAmenityEntity): Promise<UnitAmenityEntity> {
    const persistence = UnitAmenityDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return UnitAmenityDataMapper.toDomain(persistence);
  }

  async find_by_unit_and_amenity(
    unit_id: string,
    amenity_id: string
  ): Promise<UnitAmenityEntity | null> {
    const item = this.items.find(
      (i) => i.unit_id === unit_id && i.amenity_id === amenity_id
    );
    return item ? UnitAmenityDataMapper.toDomain(item) : null;
  }

  async list_by_unit(unit_id: string): Promise<UnitAmenityEntity[]> {
    return this.items
      .filter((i) => i.unit_id === unit_id)
      .map(UnitAmenityDataMapper.toDomain);
  }

  async delete(unit_id: string, amenity_id: string): Promise<boolean> {
    const index = this.items.findIndex(
      (i) => i.unit_id === unit_id && i.amenity_id === amenity_id
    );
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
