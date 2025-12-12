import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreateOrganizationUseCase } from './create-organization.usecase';
import { InMemoryOrganizationRepository } from '@/infra/repositories/in-memory/organizations/in-memory-organization.repository';
import { InMemoryUserRepository } from '@/infra/repositories/in-memory/users/in-memory-user.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { InvalidBusinessNameError } from '@/domain/errors/organizations/organization.errors';

describe('CreateOrganizationUseCase', () => {
  let sut: CreateOrganizationUseCase;
  let organization_repository: InMemoryOrganizationRepository;
  let user_repository: InMemoryUserRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    organization_repository = new InMemoryOrganizationRepository();
    user_repository = new InMemoryUserRepository();
    sut = new CreateOrganizationUseCase(organization_repository, user_repository);
  });

  it('should create a new organization successfully', async () => {
    const input = {
      name: 'Beleza Salon',
      owner_id: 'usr_123',
    };

    const result = await sut.execute(input);

    expect(result.name).toBe('Beleza Salon');
    expect(result.ownerId).toBe('usr_123');
    expect(result.id).toContain('org_');
  });

  it('should allow same owner to create multiple organizations', async () => {
    const input1 = {
      name: 'First Salon',
      owner_id: 'usr_789',
    };

    const input2 = {
      name: 'Second Salon',
      owner_id: 'usr_789',
    };

    const result1 = await sut.execute(input1);
    const result2 = await sut.execute(input2);

    expect(result1.ownerId).toBe('usr_789');
    expect(result2.ownerId).toBe('usr_789');
    expect(result1.id).not.toBe(result2.id);
  });

  it('should throw error if business name is too short', async () => {
    const input = {
      name: 'A',
      owner_id: 'usr_999',
    };

    await expect(sut.execute(input)).rejects.toThrow(InvalidBusinessNameError);
  });

  it('should throw error if business name is empty', async () => {
    const input = {
      name: '',
      owner_id: 'usr_999',
    };

    await expect(sut.execute(input)).rejects.toThrow(InvalidBusinessNameError);
  });
});
