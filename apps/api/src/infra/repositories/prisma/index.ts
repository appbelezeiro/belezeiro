// Client
export { prisma, connectPrisma, disconnectPrisma } from './client/index.js';

// Data Mappers
export * from './data-mappers/index.js';

// Core Repositories
export { PrismaUserRepository } from './users/user.repository.js';
export { PrismaOrganizationRepository } from './organizations/organization.repository.js';
export { PrismaUnitRepository } from './units/unit.repository.js';
export { PrismaUnitAvailabilityRuleRepository } from './units/unit-availability-rule.repository.js';
export { PrismaUnitAvailabilityExceptionRepository } from './units/unit-availability-exception.repository.js';

// Catalog Repositories
export { PrismaSpecialtyRepository } from './catalog/specialty.repository.js';
export { PrismaAmenityRepository } from './catalog/amenity.repository.js';
export { PrismaServiceRepository } from './catalog/service.repository.js';
export { PrismaUnitSpecialtyRepository } from './catalog/unit-specialty.repository.js';
export { PrismaUnitAmenityRepository } from './catalog/unit-amenity.repository.js';
export { PrismaUnitServiceRepository } from './catalog/unit-service.repository.js';

// Booking Repositories
export { PrismaBookingRepository } from './bookings/booking.repository.js';
export { PrismaBookingRuleRepository } from './bookings/booking-rule.repository.js';
export { PrismaBookingExceptionRepository } from './bookings/booking-exception.repository.js';

// Billing Repositories
export { PrismaPlanRepository } from './billing/plan.repository.js';
export { PrismaSubscriptionRepository } from './billing/subscription.repository.js';
export { PrismaInvoiceRepository } from './billing/invoice.repository.js';
export { PrismaDiscountRepository } from './billing/discount.repository.js';
export { PrismaCouponRedemptionRepository } from './billing/coupon-redemption.repository.js';

// Notification Repositories
export { PrismaNotificationRepository } from './notifications/notification.repository.js';
export { PrismaNotificationTemplateRepository } from './notifications/notification-template.repository.js';
export { PrismaNotificationPreferenceRepository } from './notifications/notification-preference.repository.js';
