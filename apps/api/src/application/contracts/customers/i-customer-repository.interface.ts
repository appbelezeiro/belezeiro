import { CustomerEntity } from '@/domain/entities/customers/customer.entity';

export interface ICustomerRepository {
  create(entity: CustomerEntity): Promise<CustomerEntity>;
  find_by_id(id: string): Promise<CustomerEntity | null>;
  find_by_user_and_unit(userId: string, unitId: string): Promise<CustomerEntity | null>;
  find_by_unit_id(unitId: string): Promise<CustomerEntity[]>;
  find_by_user_id(userId: string): Promise<CustomerEntity[]>;
  count_by_unit_id(unitId: string): Promise<number>;
  count_new_customers_in_period(unitId: string, startDate: Date, endDate: Date): Promise<number>;
  update(entity: CustomerEntity): Promise<CustomerEntity>;
  delete(id: string): Promise<boolean>;
}
