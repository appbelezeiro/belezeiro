import { UnitEntity } from '@/domain/entities/units/unit.entity';
import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface';
import { UnitDataMapper, UnitPersistence } from '../data-mappers/units/unit.data-mapper';

export class InMemoryUnitRepository implements IUnitRepository {
  private items: UnitPersistence[] = [];

  async create(entity: UnitEntity): Promise<UnitEntity> {
    const persistence = UnitDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return UnitDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<UnitEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? UnitDataMapper.toDomain(item) : null;
  }

  async find_by_organization_id(organizationId: string): Promise<UnitEntity[]> {
    return this.items
      .filter((i) => i.orgId === organizationId)
      .map(UnitDataMapper.toDomain);
  }

  async list_all(): Promise<UnitEntity[]> {
    return this.items.map(UnitDataMapper.toDomain);
  }

  async list_active(): Promise<UnitEntity[]> {
    return this.items.filter((i) => i.active).map(UnitDataMapper.toDomain);
  }

  async update(entity: UnitEntity): Promise<UnitEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`Unit with id ${entity.id} not found`);
    }

    const persistence = UnitDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return UnitDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
