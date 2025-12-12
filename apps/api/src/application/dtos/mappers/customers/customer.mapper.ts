import { CustomerEntity } from '@/domain/entities/customers/customer.entity';
import { CustomerDTO } from '../../customers/customer.dto';

export class CustomerMapper {
  static toDTO(entity: CustomerEntity): CustomerDTO {
    return {
      id: entity.id,
      userId: entity.userId,
      unitId: entity.unitId,
      notes: entity.notes,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toDTOList(entities: CustomerEntity[]): CustomerDTO[] {
    return entities.map(this.toDTO);
  }
}
