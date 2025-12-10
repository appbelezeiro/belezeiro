import { UserEntity } from '@/domain/entities/user.entity';
import { IUserRepository } from '@/application/contracts/i-user-repository.interface';
import { UserNotFoundError } from '@/domain/errors/user-not-found.error';

class UseCase {
  constructor(private readonly user_repository: IUserRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const user = await this.user_repository.find_by_id(input.user_id);

    if (!user) {
      throw new UserNotFoundError(input.user_id);
    }

    return user;
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
  };

  export type Output = Promise<UserEntity>;
}

export { UseCase as GetProfileUseCase };
