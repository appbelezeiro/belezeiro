import { ServiceEntity } from '@/domain/entities/service.entity';
import { IServiceRepository } from '@/application/contracts/i-service-repository.interface';

class UseCase {
  constructor(private readonly service_repository: IServiceRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const created: ServiceEntity[] = [];

    for (const seed of input.seeds) {
      // Check if already exists
      const existing = await this.service_repository.find_by_code(seed.code);

      if (!existing) {
        // Create with fixed ID
        const service = new ServiceEntity({
          id: `serv_${seed.code}`,
          specialty_id: seed.specialty_id,
          code: seed.code,
          name: seed.name,
          description: seed.description,
          default_duration_minutes: seed.default_duration_minutes,
          default_price_cents: seed.default_price_cents,
          is_predefined: true,
        });

        const created_service = await this.service_repository.create(service);
        created.push(created_service);
      }
    }

    return created;
  }
}

declare namespace UseCase {
  export type Input = {
    seeds: Array<{
      specialty_id: string;
      code: string;
      name: string;
      description?: string;
      default_duration_minutes: number;
      default_price_cents: number;
    }>;
  };

  export type Output = Promise<ServiceEntity[]>;
}

export { UseCase as SeedServicesUseCase };
