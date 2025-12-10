import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';
import { IOrganizationRepository } from '@/application/contracts/organizations/i-organization-repository.interface';
import { OrganizationAlreadyExistsError } from '@/domain/errors/organizations/organization.errors';

class UseCase {
  constructor(private readonly organization_repository: IOrganizationRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // Check if organization already exists for this owner
    const existing = await this.organization_repository.find_by_owner_id(input.ownerId);

    if (existing) {
      throw new OrganizationAlreadyExistsError(
        'Organization already exists for this owner'
      );
    }

    const organization = new OrganizationEntity({
      businessName: input.businessName,
      brandColor: input.brandColor,
      ownerId: input.ownerId,
      subscription: input.subscription,
    });

    return this.organization_repository.create(organization);
  }
}

declare namespace UseCase {
  export type Input = {
    businessName: string;
    brandColor: string;
    ownerId: string;
    subscription?: {
      plan: 'free' | 'pro' | 'enterprise';
      status: 'active' | 'inactive' | 'suspended';
      expiresAt?: Date;
    };
  };

  export type Output = Promise<OrganizationEntity>;
}

export { UseCase as CreateOrganizationUseCase };
