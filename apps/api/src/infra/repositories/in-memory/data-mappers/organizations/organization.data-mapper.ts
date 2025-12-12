import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';

export interface OrganizationPersistence {
  id: string;
  name: string;
  ownerId: string;
  created_at: Date;
  updated_at: Date;
}

export class OrganizationDataMapper {
  static toDomain(raw: OrganizationPersistence): OrganizationEntity {
    return new OrganizationEntity({
      id: raw.id,
      name: raw.name,
      ownerId: raw.ownerId,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: OrganizationEntity): OrganizationPersistence {
    return {
      id: entity.id,
      name: entity.name,
      ownerId: entity.ownerId,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
