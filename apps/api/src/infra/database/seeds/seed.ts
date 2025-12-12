import { SeedSpecialtiesUseCase } from '@/application/usecases/specialty/seed-specialties.usecase';
import { SeedServicesUseCase } from '@/application/usecases/service/seed-services.usecase';
import { SeedAmenitiesUseCase } from '@/application/usecases/amenity/seed-amenities.usecase';
import { getSpecialtyIdByCode, SpecialtyCode } from '@/domain/constants/seed-ids';
import { SPECIALTY_SEEDS } from './specialty-seeds';
import { SERVICE_SEEDS } from './service-seeds';
import { AMENITY_SEEDS } from './amenity-seeds';

export async function runSeeds(
  seed_specialties_usecase: SeedSpecialtiesUseCase,
  seed_services_usecase: SeedServicesUseCase,
  seed_amenities_usecase: SeedAmenitiesUseCase
): Promise<void> {
  console.log('🌱 Starting database seeds...');

  // Seed specialties
  console.log('  → Seeding specialties...');
  const specialties = await seed_specialties_usecase.execute({
    seeds: SPECIALTY_SEEDS,
  });
  console.log(`  ✓ Created ${specialties.length} specialties`);

  // Seed services with deterministic specialty_ids
  console.log('  → Seeding services...');
  const services = await seed_services_usecase.execute({
    seeds: SERVICE_SEEDS.map((seed) => ({
      ...seed,
      specialty_id: getSpecialtyIdByCode(seed.specialty_code as SpecialtyCode),
    })),
  });
  console.log(`  ✓ Created ${services.length} services`);

  // Seed amenities
  console.log('  → Seeding amenities...');
  const amenities = await seed_amenities_usecase.execute({
    seeds: AMENITY_SEEDS,
  });
  console.log(`  ✓ Created ${amenities.length} amenities`);

  console.log('🌱 Database seeding completed!\n');
}
