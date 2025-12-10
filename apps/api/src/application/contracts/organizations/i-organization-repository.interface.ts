import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';

export interface IOrganizationRepository {
  create(entity: OrganizationEntity): Promise<OrganizationEntity>;
  find_by_id(id: string): Promise<OrganizationEntity | null>;
  find_by_owner_id(ownerId: string): Promise<OrganizationEntity | null>;
  list_all(): Promise<OrganizationEntity[]>;
  update(entity: OrganizationEntity): Promise<OrganizationEntity>;
  delete(id: string): Promise<boolean>;
}
