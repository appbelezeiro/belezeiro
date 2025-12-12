import {
  PrismaUserRepository,
  PrismaOrganizationRepository,
  PrismaUnitRepository,
  PrismaUnitAvailabilityRuleRepository,
  PrismaUnitAvailabilityExceptionRepository,
  PrismaCustomerRepository,
  PrismaSpecialtyRepository,
  PrismaAmenityRepository,
  PrismaServiceRepository,
  PrismaUnitSpecialtyRepository,
  PrismaUnitAmenityRepository,
  PrismaUnitServiceRepository,
  PrismaBookingRepository,
  PrismaBookingRuleRepository,
  PrismaBookingExceptionRepository,
  PrismaPlanRepository,
  PrismaSubscriptionRepository,
  PrismaInvoiceRepository,
  PrismaDiscountRepository,
  PrismaCouponRedemptionRepository,
} from '@/infra/repositories/prisma';
import type { Clients } from './clients.factory';

export function createRepositories(_clients: Clients) {
  const user_repository = new PrismaUserRepository();
  const booking_rule_repository = new PrismaBookingRuleRepository();
  const booking_exception_repository = new PrismaBookingExceptionRepository();
  const booking_repository = new PrismaBookingRepository();
  const organization_repository = new PrismaOrganizationRepository();
  const unit_repository = new PrismaUnitRepository();

  // Billing repositories
  const plan_repository = new PrismaPlanRepository();
  const subscription_repository = new PrismaSubscriptionRepository();
  const invoice_repository = new PrismaInvoiceRepository();
  const discount_repository = new PrismaDiscountRepository();
  const coupon_redemption_repository = new PrismaCouponRedemptionRepository();

  // Specialties and Services repositories
  const specialty_repository = new PrismaSpecialtyRepository();
  const service_repository = new PrismaServiceRepository();
  const unit_specialty_repository = new PrismaUnitSpecialtyRepository();
  const unit_service_repository = new PrismaUnitServiceRepository();

  // Amenities repositories
  const amenity_repository = new PrismaAmenityRepository();
  const unit_amenity_repository = new PrismaUnitAmenityRepository();

  // Unit Availability repositories
  const unit_availability_rule_repository = new PrismaUnitAvailabilityRuleRepository();
  const unit_availability_exception_repository = new PrismaUnitAvailabilityExceptionRepository();

  // Customer repository
  const customer_repository = new PrismaCustomerRepository();

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
    amenity_repository,
    unit_amenity_repository,
    unit_availability_rule_repository,
    unit_availability_exception_repository,
    customer_repository,
  };
}

export type Repositories = ReturnType<typeof createRepositories>;
