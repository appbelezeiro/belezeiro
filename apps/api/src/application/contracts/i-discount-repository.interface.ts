import { DiscountEntity } from '@/domain/entities/discount.entity';

export interface IDiscountRepository {
  create(entity: DiscountEntity): Promise<DiscountEntity>;
  find_by_id(id: string): Promise<DiscountEntity | null>;
  find_by_code(code: string): Promise<DiscountEntity | null>;
  list_active(): Promise<DiscountEntity[]>;
  list_all(): Promise<DiscountEntity[]>;
  update(entity: DiscountEntity): Promise<DiscountEntity>;
  delete(id: string): Promise<boolean>;
}
