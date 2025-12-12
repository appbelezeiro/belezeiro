import { IOrganizationRepository } from '@/application/contracts/organizations/i-organization-repository.interface.js';
import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity.js';
import { prisma } from '../client/index.js';
import { OrganizationDataMapper } from '../data-mappers/index.js';

export class PrismaOrganizationRepository implements IOrganizationRepository {
  async create(entity: OrganizationEntity): Promise<OrganizationEntity> {
    const data = OrganizationDataMapper.toPrismaCreate(entity);
    const created = await prisma.organization.create({ data });
    return OrganizationDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<OrganizationEntity | null> {
    const found = await prisma.organization.findUnique({ where: { id } });
    return found ? OrganizationDataMapper.toDomain(found) : null;
  }

  async find_by_owner_id(ownerId: string): Promise<OrganizationEntity | null> {
    const found = await prisma.organization.findUnique({ where: { owner_id: ownerId } });
    return found ? OrganizationDataMapper.toDomain(found) : null;
  }

  async list_all(): Promise<OrganizationEntity[]> {
    const organizations = await prisma.organization.findMany({
      orderBy: { created_at: 'desc' },
    });
    return organizations.map(OrganizationDataMapper.toDomain);
  }

  async update(entity: OrganizationEntity): Promise<OrganizationEntity> {
    const data = OrganizationDataMapper.toPrisma(entity);
    const updated = await prisma.organization.update({
      where: { id: entity.id },
      data,
    });
    return OrganizationDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.organization.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
