import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';
import { IOrganizationRepository } from '@/application/contracts/organizations/i-organization-repository.interface';

class UseCase {
  constructor(private readonly organization_repository: IOrganizationRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.organization_repository.list_by_owner_id(input.ownerId);
  }
}

declare namespace UseCase {
  export type Input = {
    ownerId: string;
  };

  export type Output = Promise<OrganizationEntity[]>;
}

export { UseCase as ListOrganizationsByOwnerUseCase };
