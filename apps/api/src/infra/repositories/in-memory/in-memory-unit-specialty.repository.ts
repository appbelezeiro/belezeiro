import { UnitSpecialtyEntity } from '@/domain/entities/unit-specialty.entity';
import { IUnitSpecialtyRepository } from '@/application/contracts/i-unit-specialty-repository.interface';
import {
  UnitSpecialtyDataMapper,
  UnitSpecialtyPersistence,
} from './data-mappers/unit-specialty.data-mapper';

export class InMemoryUnitSpecialtyRepository implements IUnitSpecialtyRepository {
  private items: UnitSpecialtyPersistence[] = [];

  async create(entity: UnitSpecialtyEntity): Promise<UnitSpecialtyEntity> {
    const persistence = UnitSpecialtyDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return UnitSpecialtyDataMapper.toDomain(persistence);
  }

  async find_by_unit_and_specialty(
    unit_id: string,
    specialty_id: string
  ): Promise<UnitSpecialtyEntity | null> {
    const item = this.items.find(
      (i) => i.unit_id === unit_id && i.specialty_id === specialty_id
    );
    return item ? UnitSpecialtyDataMapper.toDomain(item) : null;
  }

  async list_by_unit(unit_id: string): Promise<UnitSpecialtyEntity[]> {
    return this.items
      .filter((i) => i.unit_id === unit_id)
      .map(UnitSpecialtyDataMapper.toDomain);
  }

  async delete(unit_id: string, specialty_id: string): Promise<boolean> {
    const index = this.items.findIndex(
      (i) => i.unit_id === unit_id && i.specialty_id === specialty_id
    );
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
