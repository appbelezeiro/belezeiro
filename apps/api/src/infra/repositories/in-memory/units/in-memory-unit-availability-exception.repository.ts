import { UnitAvailabilityExceptionEntity } from '@/domain/entities/units/unit-availability-exception.entity';
import { IUnitAvailabilityExceptionRepository } from '@/application/contracts/units/i-unit-availability-exception-repository.interface';
import {
  UnitAvailabilityExceptionDataMapper,
  UnitAvailabilityExceptionPersistence,
} from '../data-mappers/units/unit-availability-exception.data-mapper';

export class InMemoryUnitAvailabilityExceptionRepository
  implements IUnitAvailabilityExceptionRepository
{
  private items: UnitAvailabilityExceptionPersistence[] = [];

  async create(
    entity: UnitAvailabilityExceptionEntity
  ): Promise<UnitAvailabilityExceptionEntity> {
    const persistence = UnitAvailabilityExceptionDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return UnitAvailabilityExceptionDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<UnitAvailabilityExceptionEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? UnitAvailabilityExceptionDataMapper.toDomain(item) : null;
  }

  async find_by_unit_id(unit_id: string): Promise<UnitAvailabilityExceptionEntity[]> {
    return this.items
      .filter((i) => i.unit_id === unit_id)
      .map(UnitAvailabilityExceptionDataMapper.toDomain);
  }

  async find_by_unit_id_and_date(
    unit_id: string,
    date: string
  ): Promise<UnitAvailabilityExceptionEntity | null> {
    const item = this.items.find((i) => i.unit_id === unit_id && i.date === date);
    return item ? UnitAvailabilityExceptionDataMapper.toDomain(item) : null;
  }

  async find_by_unit_id_and_date_range(
    unit_id: string,
    start_date: string,
    end_date: string
  ): Promise<UnitAvailabilityExceptionEntity[]> {
    return this.items
      .filter(
        (i) => i.unit_id === unit_id && i.date >= start_date && i.date <= end_date
      )
      .map(UnitAvailabilityExceptionDataMapper.toDomain);
  }

  async update(
    entity: UnitAvailabilityExceptionEntity
  ): Promise<UnitAvailabilityExceptionEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`UnitAvailabilityException with id ${entity.id} not found`);
    }

    const persistence = UnitAvailabilityExceptionDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return UnitAvailabilityExceptionDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  async delete_all_by_unit_id(unit_id: string): Promise<number> {
    const initial_length = this.items.length;
    this.items = this.items.filter((i) => i.unit_id !== unit_id);
    return initial_length - this.items.length;
  }
}
