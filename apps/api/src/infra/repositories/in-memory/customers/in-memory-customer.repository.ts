import { CustomerEntity } from '@/domain/entities/customers/customer.entity';
import { ICustomerRepository } from '@/application/contracts/customers/i-customer-repository.interface';
import { CustomerDataMapper, CustomerPersistence } from '../data-mappers/customers/customer.data-mapper';

export class InMemoryCustomerRepository implements ICustomerRepository {
  private customers: CustomerPersistence[] = [];

  async create(entity: CustomerEntity): Promise<CustomerEntity> {
    const persistence = CustomerDataMapper.toPersistence(entity);
    this.customers.push(persistence);
    return CustomerDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<CustomerEntity | null> {
    const customer = this.customers.find((c) => c.id === id);
    return customer ? CustomerDataMapper.toDomain(customer) : null;
  }

  async find_by_user_and_unit(userId: string, unitId: string): Promise<CustomerEntity | null> {
    const customer = this.customers.find(
      (c) => c.userId === userId && c.unitId === unitId
    );
    return customer ? CustomerDataMapper.toDomain(customer) : null;
  }

  async find_by_unit_id(unitId: string): Promise<CustomerEntity[]> {
    const filtered = this.customers.filter((c) => c.unitId === unitId);
    return filtered.map(CustomerDataMapper.toDomain);
  }

  async find_by_user_id(userId: string): Promise<CustomerEntity[]> {
    const filtered = this.customers.filter((c) => c.userId === userId);
    return filtered.map(CustomerDataMapper.toDomain);
  }

  async count_by_unit_id(unitId: string): Promise<number> {
    return this.customers.filter((c) => c.unitId === unitId).length;
  }

  async count_new_customers_in_period(unitId: string, startDate: Date, endDate: Date): Promise<number> {
    return this.customers.filter(
      (c) =>
        c.unitId === unitId &&
        c.created_at >= startDate &&
        c.created_at <= endDate
    ).length;
  }

  async update(entity: CustomerEntity): Promise<CustomerEntity> {
    const index = this.customers.findIndex((c) => c.id === entity.id);
    if (index === -1) {
      throw new Error(`Customer with id ${entity.id} not found`);
    }

    const persistence = CustomerDataMapper.toPersistence(entity);
    this.customers[index] = persistence;
    return CustomerDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) return false;

    this.customers.splice(index, 1);
    return true;
  }
}
