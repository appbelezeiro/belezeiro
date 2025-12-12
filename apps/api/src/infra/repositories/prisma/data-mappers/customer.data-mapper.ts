import { Customer as PrismaCustomer } from '@prisma/client';
import { CustomerEntity } from '@/domain/entities/customers/customer.entity.js';

export class CustomerDataMapper {
  static toDomain(raw: PrismaCustomer): CustomerEntity {
    return new CustomerEntity({
      id: raw.id,
      userId: raw.user_id,
      unitId: raw.unit_id,
      notes: raw.notes ?? undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: CustomerEntity): Omit<PrismaCustomer, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      user_id: entity.userId,
      unit_id: entity.unitId,
      notes: entity.notes ?? null,
    };
  }

  static toPrismaCreate(entity: CustomerEntity): Omit<PrismaCustomer, 'updated_at'> {
    return {
      id: entity.id,
      user_id: entity.userId,
      unit_id: entity.unitId,
      notes: entity.notes ?? null,
      created_at: entity.created_at,
    };
  }
}
