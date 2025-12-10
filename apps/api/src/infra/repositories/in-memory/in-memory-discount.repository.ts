import { DiscountEntity } from '@/domain/entities/discount.entity';
import { IDiscountRepository } from '@/application/contracts/i-discount-repository.interface';
import { DiscountDataMapper, DiscountPersistence } from './data-mappers/discount.data-mapper';

export class InMemoryDiscountRepository implements IDiscountRepository {
  private items: DiscountPersistence[] = [];

  async create(entity: DiscountEntity): Promise<DiscountEntity> {
    const persistence = DiscountDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return DiscountDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<DiscountEntity | null> {
    const item = this.items.find((d) => d.id === id);
    return item ? DiscountDataMapper.toDomain(item) : null;
  }

  async find_by_code(code: string): Promise<DiscountEntity | null> {
    const item = this.items.find((d) => d.code === code);
    return item ? DiscountDataMapper.toDomain(item) : null;
  }

  async list_active(): Promise<DiscountEntity[]> {
    return this.items
      .filter((d) => d.is_active)
      .map(DiscountDataMapper.toDomain);
  }

  async list_all(): Promise<DiscountEntity[]> {
    return this.items.map(DiscountDataMapper.toDomain);
  }

  async update(entity: DiscountEntity): Promise<DiscountEntity> {
    const index = this.items.findIndex((d) => d.id === entity.id);
    if (index === -1) {
      throw new Error(`Discount with id ${entity.id} not found`);
    }

    const persistence = DiscountDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return DiscountDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((d) => d.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
