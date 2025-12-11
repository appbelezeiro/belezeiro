import { ServiceEntity } from '@/domain/entities/service.entity';
import { IServiceRepository } from '@/application/contracts/i-service-repository.interface';
import { ISpecialtyRepository } from '@/application/contracts/i-specialty-repository.interface';
import { ServiceCodeAlreadyExistsError } from '@/domain/errors/service-code-already-exists.error';
import { SpecialtyNotFoundError } from '@/domain/errors/specialty-not-found.error';

class UseCase {
  constructor(
    private readonly service_repository: IServiceRepository,
    private readonly specialty_repository: ISpecialtyRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // Validate specialty exists
    const specialty = await this.specialty_repository.find_by_id(input.specialty_id);
    if (!specialty) {
      throw new SpecialtyNotFoundError(`Specialty '${input.specialty_id}' not found`);
    }

    // Check if code already exists
    const existing = await this.service_repository.find_by_code(input.code);
    if (existing) {
      throw new ServiceCodeAlreadyExistsError(input.code);
    }

    const service = new ServiceEntity({
      specialty_id: input.specialty_id,
      code: input.code,
      name: input.name,
      description: input.description,
      default_duration_minutes: input.default_duration_minutes,
      default_price_cents: input.default_price_cents,
      is_predefined: false, // Custom services created by users
    });

    return this.service_repository.create(service);
  }
}

declare namespace UseCase {
  export type Input = {
    specialty_id: string;
    code: string;
    name: string;
    description?: string;
    default_duration_minutes: number;
    default_price_cents: number;
  };

  export type Output = Promise<ServiceEntity>;
}

export { UseCase as CreateServiceUseCase };
