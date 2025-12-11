import { IServiceRepository } from '@/application/contracts/i-service-repository.interface';

class UseCase {
  constructor(private readonly service_repository: IServiceRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.service_repository.delete(input.id);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
  };

  export type Output = Promise<boolean>;
}

export { UseCase as DeleteServiceUseCase };
