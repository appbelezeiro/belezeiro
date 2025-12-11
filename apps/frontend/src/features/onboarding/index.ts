// ============================================================================
// ONBOARDING FEATURE - Public exports
// ============================================================================

// API
export { onboardingService } from './api';

// Types
export type {
  // Organization
  SubscriptionPlan,
  SubscriptionStatus,
  Subscription,
  CreateOrganizationRequest,
  OrganizationDTO,
  // Unit
  ServiceType,
  DayOfWeek,
  AmenityId,
  DaySchedule,
  Address,
  ProfessionRef,
  ServiceRef,
  LunchBreak,
  WorkingHours,
  CreateUnitRequest,
  UnitDTO,
  UnitListResponse,
  // Onboarding
  OnboardingSubmitData,
  OnboardingResult,
} from './types';

// Hooks
export { useSubmitOnboarding } from './hooks/mutations';
export { useOnboardingStatus } from './hooks/queries';

// Schemas
export {
  createOrganizationRequestSchema,
  createUnitRequestSchema,
  onboardingSubmitDataSchema,
} from './schemas';

// UI Components
export * from './ui';
