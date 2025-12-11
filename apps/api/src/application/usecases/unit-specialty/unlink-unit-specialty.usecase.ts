import { IUnitSpecialtyRepository } from '@/application/contracts/i-unit-specialty-repository.interface';

class UseCase {
  constructor(private readonly unit_specialty_repository: IUnitSpecialtyRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.unit_specialty_repository.delete(input.unit_id, input.specialty_id);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    specialty_id: string;
  };

  export type Output = Promise<boolean>;
}

export { UseCase as UnlinkUnitSpecialtyUseCase };
