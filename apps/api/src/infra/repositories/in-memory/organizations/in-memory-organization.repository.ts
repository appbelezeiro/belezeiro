import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';
import { IOrganizationRepository } from '@/application/contracts/organizations/i-organization-repository.interface';
import {
  OrganizationDataMapper,
  OrganizationPersistence,
} from '../data-mappers/organizations/organization.data-mapper';

export class InMemoryOrganizationRepository implements IOrganizationRepository {
  private items: OrganizationPersistence[] = [];

  async create(entity: OrganizationEntity): Promise<OrganizationEntity> {
    const persistence = OrganizationDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return OrganizationDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<OrganizationEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? OrganizationDataMapper.toDomain(item) : null;
  }

  async find_by_owner_id(ownerId: string): Promise<OrganizationEntity | null> {
    const item = this.items.find((i) => i.ownerId === ownerId);
    return item ? OrganizationDataMapper.toDomain(item) : null;
  }

  async list_all(): Promise<OrganizationEntity[]> {
    return this.items.map(OrganizationDataMapper.toDomain);
  }

  async update(entity: OrganizationEntity): Promise<OrganizationEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`Organization with id ${entity.id} not found`);
    }

    const persistence = OrganizationDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return OrganizationDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
