import { InMemoryUserRepository } from '@/infra/repositories/in-memory/users/in-memory-user.repository';
import { InMemoryBookingRuleRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking-rule.repository';
import { InMemoryBookingExceptionRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking-exception.repository';
import { InMemoryBookingRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking.repository';
import { InMemoryOrganizationRepository } from '@/infra/repositories/in-memory/organizations/in-memory-organization.repository';
import { InMemoryUnitRepository } from '@/infra/repositories/in-memory/units/in-memory-unit.repository';
import { InMemoryPlanRepository } from '@/infra/repositories/in-memory/billing/in-memory-plan.repository';
import { InMemorySubscriptionRepository } from '@/infra/repositories/in-memory/billing/in-memory-subscription.repository';
import { InMemoryInvoiceRepository } from '@/infra/repositories/in-memory/billing/in-memory-invoice.repository';
import { InMemoryDiscountRepository } from '@/infra/repositories/in-memory/billing/in-memory-discount.repository';
import { InMemoryCouponRedemptionRepository } from '@/infra/repositories/in-memory/billing/in-memory-coupon-redemption.repository';
import { InMemorySpecialtyRepository } from '@/infra/repositories/in-memory/in-memory-specialty.repository';
import { InMemoryServiceRepository } from '@/infra/repositories/in-memory/in-memory-service.repository';
import { InMemoryUnitSpecialtyRepository } from '@/infra/repositories/in-memory/in-memory-unit-specialty.repository';
import { InMemoryUnitServiceRepository } from '@/infra/repositories/in-memory/in-memory-unit-service.repository';
import type { Clients } from './clients.factory';

export function createRepositories(_clients: Clients) {
  const user_repository = new InMemoryUserRepository();
  const booking_rule_repository = new InMemoryBookingRuleRepository();
  const booking_exception_repository = new InMemoryBookingExceptionRepository();
  const booking_repository = new InMemoryBookingRepository();
  const organization_repository = new InMemoryOrganizationRepository();
  const unit_repository = new InMemoryUnitRepository();

  // Billing repositories
  const plan_repository = new InMemoryPlanRepository();
  const subscription_repository = new InMemorySubscriptionRepository();
  const invoice_repository = new InMemoryInvoiceRepository();
  const discount_repository = new InMemoryDiscountRepository();
  const coupon_redemption_repository = new InMemoryCouponRedemptionRepository();

  // Specialties and Services repositories
  const specialty_repository = new InMemorySpecialtyRepository();
  const service_repository = new InMemoryServiceRepository();
  const unit_specialty_repository = new InMemoryUnitSpecialtyRepository();
  const unit_service_repository = new InMemoryUnitServiceRepository();

  return {
    user_repository,
    booking_rule_repository,
    booking_exception_repository,
    booking_repository,
    organization_repository,
    unit_repository,
    plan_repository,
    subscription_repository,
    invoice_repository,
    discount_repository,
    coupon_redemption_repository,
    specialty_repository,
    service_repository,
    unit_specialty_repository,
    unit_service_repository,
  };
}

export type Repositories = ReturnType<typeof createRepositories>;
