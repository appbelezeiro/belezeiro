import { IUnitServiceRepository } from '@/application/contracts/i-unit-service-repository.interface';

class UseCase {
  constructor(private readonly unit_service_repository: IUnitServiceRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.unit_service_repository.delete(input.unit_id, input.service_id);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    service_id: string;
  };

  export type Output = Promise<boolean>;
}

export { UseCase as RemoveUnitServiceUseCase };
