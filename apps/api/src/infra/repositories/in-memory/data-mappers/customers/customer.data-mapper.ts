import { CustomerEntity } from '@/domain/entities/customers/customer.entity';

export interface CustomerPersistence {
  id: string;
  userId: string;
  unitId: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export class CustomerDataMapper {
  static toDomain(raw: CustomerPersistence): CustomerEntity {
    return new CustomerEntity({
      id: raw.id,
      userId: raw.userId,
      unitId: raw.unitId,
      notes: raw.notes,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: CustomerEntity): CustomerPersistence {
    return {
      id: entity.id,
      userId: entity.userId,
      unitId: entity.unitId,
      notes: entity.notes,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
