import { UserEntity } from '@/domain/entities/user.entity';
import { IUserRepository } from '@/application/contracts/i-user-repository.interface';
import { EmailAlreadyExistsError } from '@/domain/errors/email-already-exists.error';

class UseCase {
  constructor(private readonly user_repository: IUserRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const existing_user_by_provider = await this.user_repository.find_by_provider_id(
      input.providerId,
    );

    if (existing_user_by_provider) {
      return {
        user: existing_user_by_provider,
        is_new_user: false,
      };
    }

    const existing_user_by_email = await this.user_repository.find_by_email(input.email);

    if (existing_user_by_email) {
      throw new EmailAlreadyExistsError(input.email);
    }

    const new_user = new UserEntity({
      name: input.name,
      email: input.email,
      providerId: input.providerId,
      photoUrl: input.photoUrl,
    });

    const created_user = await this.user_repository.create(new_user);

    return {
      user: created_user,
      is_new_user: true,
    };
  }
}

declare namespace UseCase {
  export type Input = {
    name: string;
    email: string;
    providerId: string;
    photoUrl?: string;
  };

  export type Output = Promise<{
    user: UserEntity;
    is_new_user: boolean;
  }>;
}

export { UseCase as AuthenticateWithProviderUseCase };
