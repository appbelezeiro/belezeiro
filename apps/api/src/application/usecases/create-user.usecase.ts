import { UserEntity } from '@/domain/entities/user.entity';
import { IUserRepository } from '@/application/contracts/i-user-repository.interface';

class UseCase {
  constructor(private readonly user_repository: IUserRepository) { }

  async execute(input: UseCase.Input): UseCase.Output {
    const user = new UserEntity({
      name: input.name,
      email: input.email,
      providerId: input.providerId,
      photoUrl: input.photoUrl,
    });

    return this.user_repository.create(user);
  }
}

declare namespace UseCase {
  export type Input = {
    name: string;
    email: string;
    providerId: string;
    photoUrl?: string;
  };

  export type Output = Promise<UserEntity>;
}

export { UseCase as CreateUserUseCase };
