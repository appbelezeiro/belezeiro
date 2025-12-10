import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user.repository';
import { InMemoryBookingRuleRepository } from '@/infra/repositories/in-memory/in-memory-booking-rule.repository';
import { InMemoryBookingExceptionRepository } from '@/infra/repositories/in-memory/in-memory-booking-exception.repository';
import { InMemoryBookingRepository } from '@/infra/repositories/in-memory/in-memory-booking.repository';
import { InMemoryOrganizationRepository } from '@/infra/repositories/in-memory/in-memory-organization.repository';
import { InMemoryUnitRepository } from '@/infra/repositories/in-memory/in-memory-unit.repository';
import type { Clients } from './clients.factory';

export function createRepositories(_clients: Clients) {
  const user_repository = new InMemoryUserRepository();
  const booking_rule_repository = new InMemoryBookingRuleRepository();
  const booking_exception_repository = new InMemoryBookingExceptionRepository();
  const booking_repository = new InMemoryBookingRepository();
  const organization_repository = new InMemoryOrganizationRepository();
  const unit_repository = new InMemoryUnitRepository();

  return {
    user_repository,
    booking_rule_repository,
    booking_exception_repository,
    booking_repository,
    organization_repository,
    unit_repository,
  };
}

export type Repositories = ReturnType<typeof createRepositories>;
