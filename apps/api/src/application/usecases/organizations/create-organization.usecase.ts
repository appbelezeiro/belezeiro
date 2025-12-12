import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';
import { IOrganizationRepository } from '@/application/contracts/organizations/i-organization-repository.interface';
import { IUserRepository } from '@/application/contracts/users/i-user-repository.interface';

class UseCase {
  constructor(
    private readonly organization_repository: IOrganizationRepository,
    private readonly user_repository: IUserRepository
  ) { }

  async execute(input: UseCase.Input): UseCase.Output {
    const organization = new OrganizationEntity({
      name: input.name,
      ownerId: input.owner_id,
    });

    const created_organization = await this.organization_repository.create(organization);

    // Mark onboarding as complete for the user (first business)
    const user = await this.user_repository.find_by_id(input.owner_id);
    if (user && !user.onboardingCompleted) {
      user.complete_onboarding();
      await this.user_repository.update(user);
    }

    return created_organization;
  }
}

declare namespace UseCase {
  export type Input = {
    name: string;
    owner_id: string;
  };

  export type Output = Promise<OrganizationEntity>;
}

export { UseCase as CreateOrganizationUseCase };
