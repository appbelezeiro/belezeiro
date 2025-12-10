import { OrganizationEntity } from '@/domain/entities/organization.entity';
import { IOrganizationRepository } from '@/application/contracts/i-organization-repository.interface';

class UseCase {
  constructor(private readonly organization_repository: IOrganizationRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.organization_repository.find_by_id(input.id);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
  };

  export type Output = Promise<OrganizationEntity | null>;
}

export { UseCase as GetOrganizationByIdUseCase };
