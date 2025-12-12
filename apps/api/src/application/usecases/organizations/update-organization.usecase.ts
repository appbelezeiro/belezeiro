import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';
import { IOrganizationRepository } from '@/application/contracts/organizations/i-organization-repository.interface';
import { OrganizationNotFoundError } from '@/domain/errors/organizations/organization.errors';

class UseCase {
  constructor(private readonly organization_repository: IOrganizationRepository) { }

  async execute(input: UseCase.Input): UseCase.Output {
    const organization = await this.organization_repository.find_by_id(input.id);

    if (!organization) {
      throw new OrganizationNotFoundError(`Organization with id ${input.id} not found`);
    }

    if (input.name !== undefined) {
      organization.update_name(input.name);
    }

    return this.organization_repository.update(organization);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
    name?: string;
  };

  export type Output = Promise<OrganizationEntity>;
}

export { UseCase as UpdateOrganizationUseCase };
