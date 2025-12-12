import { Organization as PrismaOrganization } from '@prisma/client';
import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity.js';

export class OrganizationDataMapper {
  static toDomain(raw: PrismaOrganization): OrganizationEntity {
    return new OrganizationEntity({
      id: raw.id,
      name: raw.name,
      ownerId: raw.owner_id,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: OrganizationEntity): Omit<PrismaOrganization, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      name: entity.name,
      owner_id: entity.ownerId,
    };
  }

  static toPrismaCreate(entity: OrganizationEntity): Omit<PrismaOrganization, 'updated_at'> {
    return {
      id: entity.id,
      name: entity.name,
      owner_id: entity.ownerId,
      created_at: entity.created_at,
    };
  }
}
