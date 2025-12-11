import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';
import { IOrganizationRepository } from '@/application/contracts/organizations/i-organization-repository.interface';
import { IUserRepository } from '@/application/contracts/users/i-user-repository.interface';
import { OrganizationAlreadyExistsError } from '@/domain/errors/organizations/organization.errors';

class UseCase {
  constructor(
    private readonly organization_repository: IOrganizationRepository,
    private readonly user_repository: IUserRepository
  ) {}

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
      ownerId: input.ownerId,
    });

    const created_organization = await this.organization_repository.create(organization);

    // Mark onboarding as complete for the user (first business)
    const user = await this.user_repository.find_by_id(input.ownerId);
    if (user && !user.onboardingCompleted) {
      user.complete_onboarding();
      await this.user_repository.update(user);
    }

    return created_organization;
  }
}

declare namespace UseCase {
  export type Input = {
    businessName: string;
    ownerId: string;
  };

  export type Output = Promise<OrganizationEntity>;
}

export { UseCase as CreateOrganizationUseCase };
