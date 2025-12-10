import { OrganizationEntity } from '@/domain/entities/organization.entity';

export interface OrganizationPersistence {
  id: string;
  businessName: string;
  brandColor: string;
  ownerId: string;
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'suspended';
    expiresAt?: Date;
  };
  created_at: Date;
  updated_at: Date;
}

export class OrganizationDataMapper {
  static toDomain(raw: OrganizationPersistence): OrganizationEntity {
    return new OrganizationEntity({
      id: raw.id,
      businessName: raw.businessName,
      brandColor: raw.brandColor,
      ownerId: raw.ownerId,
      subscription: raw.subscription,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: OrganizationEntity): OrganizationPersistence {
    return {
      id: entity.id,
      businessName: entity.businessName,
      brandColor: entity.brandColor,
      ownerId: entity.ownerId,
      subscription: entity.subscription,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
