import { SeedSpecialtiesUseCase } from '@/application/usecases/specialty/seed-specialties.usecase';
import { SeedServicesUseCase } from '@/application/usecases/service/seed-services.usecase';
import { SeedAmenitiesUseCase } from '@/application/usecases/amenity/seed-amenities.usecase';
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

  // Map specialty codes to IDs for service seeding
  const specialtyCodeToId = new Map<string, string>();
  for (const seed of SPECIALTY_SEEDS) {
    specialtyCodeToId.set(seed.code, `spec_${seed.code}`);
  }

  // Seed services with mapped specialty_ids
  console.log('  → Seeding services...');
  const services = await seed_services_usecase.execute({
    seeds: SERVICE_SEEDS.map((seed) => ({
      ...seed,
      specialty_id: specialtyCodeToId.get(seed.specialty_code)!,
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
