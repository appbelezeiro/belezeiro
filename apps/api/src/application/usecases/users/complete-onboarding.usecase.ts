import { UserEntity } from '@/domain/entities/users/user.entity';
import { IUserRepository } from '@/application/contracts/users/i-user-repository.interface';
import { UserNotFoundError } from '@/domain/errors/users/user-not-found.error';

class UseCase {
  constructor(private readonly user_repository: IUserRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const user = await this.user_repository.find_by_id(input.userId);

    if (!user) {
      throw new UserNotFoundError('User not found');
    }

    // Only update if not already completed (idempotent)
    if (!user.onboardingCompleted) {
      user.complete_onboarding();
      await this.user_repository.update(user);
    }

    return user;
  }
}

declare namespace UseCase {
  export type Input = {
    userId: string;
  };

  export type Output = Promise<UserEntity>;
}

export { UseCase as CompleteOnboardingUseCase };
