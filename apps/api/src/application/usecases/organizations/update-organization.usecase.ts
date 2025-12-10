import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';
import { IOrganizationRepository } from '@/application/contracts/organizations/i-organization-repository.interface';
import { OrganizationNotFoundError } from '@/domain/errors/organizations/organization.errors';

class UseCase {
  constructor(private readonly organization_repository: IOrganizationRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const organization = await this.organization_repository.find_by_id(input.id);

    if (!organization) {
      throw new OrganizationNotFoundError(`Organization with id ${input.id} not found`);
    }

    if (input.businessName !== undefined) {
      organization.update_business_name(input.businessName);
    }

    if (input.brandColor !== undefined) {
      organization.update_brand_color(input.brandColor);
    }

    if (input.subscription !== undefined) {
      organization.update_subscription(input.subscription);
    }

    return this.organization_repository.update(organization);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
    businessName?: string;
    brandColor?: string;
    subscription?: {
      plan: 'free' | 'pro' | 'enterprise';
      status: 'active' | 'inactive' | 'suspended';
      expiresAt?: Date;
    };
  };

  export type Output = Promise<OrganizationEntity>;
}

export { UseCase as UpdateOrganizationUseCase };
