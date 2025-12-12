import { ICustomerRepository } from '@/application/contracts/customers/i-customer-repository.interface.js';
import { CustomerEntity } from '@/domain/entities/customers/customer.entity.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { CustomerDataMapper } from '../data-mappers/index.js';

export class PrismaCustomerRepository implements ICustomerRepository {
  async create(entity: CustomerEntity): Promise<CustomerEntity> {
    const data = CustomerDataMapper.toPrismaCreate(entity);
    const created = await prisma.customer.create({ data });
    return CustomerDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<CustomerEntity | null> {
    const found = await prisma.customer.findUnique({ where: { id } });
    return found ? CustomerDataMapper.toDomain(found) : null;
  }

  async find_by_user_and_unit(userId: string, unitId: string): Promise<CustomerEntity | null> {
    const found = await prisma.customer.findUnique({
      where: {
        user_id_unit_id: {
          user_id: userId,
          unit_id: unitId,
        },
      },
    });
    return found ? CustomerDataMapper.toDomain(found) : null;
  }

  async find_by_unit_id(unitId: string): Promise<CustomerEntity[]> {
    const customers = await prisma.customer.findMany({
      where: { unit_id: unitId },
      orderBy: { created_at: 'desc' },
    });
    return customers.map(CustomerDataMapper.toDomain);
  }

  async find_by_user_id(userId: string): Promise<CustomerEntity[]> {
    const customers = await prisma.customer.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
    return customers.map(CustomerDataMapper.toDomain);
  }

  async count_by_unit_id(unitId: string): Promise<number> {
    return prisma.customer.count({
      where: { unit_id: unitId },
    });
  }

  async count_new_customers_in_period(unitId: string, startDate: Date, endDate: Date): Promise<number> {
    return prisma.customer.count({
      where: {
        unit_id: unitId,
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async update(entity: CustomerEntity): Promise<CustomerEntity> {
    const data = CustomerDataMapper.toPrisma(entity);
    const updated = await prisma.customer.update({
      where: { id: entity.id },
      data,
    });
    return CustomerDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.customer.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
