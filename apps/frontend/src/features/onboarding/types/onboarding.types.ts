// ============================================================================
// ONBOARDING TYPES - Tipos para integração com API
// ============================================================================

import type { AvailabilityRuleInput, AvailabilityExceptionInput } from '../../units/types/unit-availability.types';

// ============================================================================
// Organization Types
// ============================================================================

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'inactive' | 'suspended';

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  expiresAt?: string;
}

export interface CreateOrganizationRequest {
  businessName: string;
  ownerId: string;
}

export interface OrganizationDTO {
  id: string;
  businessName: string;
  ownerId: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Unit Types
// ============================================================================

export type ServiceType = 'local' | 'home' | 'both';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type AmenityId = 'wifi' | 'parking' | 'coffee' | 'ac' | 'snacks' | 'waiting-room' | 'accessibility';

export interface DaySchedule {
  enabled: boolean;
  open: string; // HH:MM format
  close: string; // HH:MM format
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface EspecialidadeRef {
  id: string;
  name: string;
  icon: string;
}

export interface ServiceRef {
  id: string;
  name: string;
  especialidadeId: string;
}

// Legacy compatibility
export type ProfessionRef = EspecialidadeRef;

export interface LunchBreak {
  enabled: boolean;
  start: string; // HH:MM format
  end: string; // HH:MM format
}

export type WorkingHours = Record<DayOfWeek, DaySchedule>;

export interface CreateUnitRequest {
  organizationId: string;
  name: string;
  brandColor: string;
  subscription?: Subscription;
  logo?: string;
  gallery?: string[];
  whatsapp: string;
  phone?: string;
  address: Address;
  especialidades: EspecialidadeRef[];
  services: ServiceRef[];
  serviceType: ServiceType;
  amenities: AmenityId[];
  // Availability is now defined through availability_rules and availability_exceptions
  availability_rules?: AvailabilityRuleInput[];
  availability_exceptions?: AvailabilityExceptionInput[];
}

export interface UnitDTO {
  id: string;
  organizationId: string;
  name: string;
  brandColor: string;
  subscription?: Subscription;
  logo?: string;
  gallery: string[];
  isActive: boolean;
  whatsapp: string;
  phone?: string;
  address: Address;
  especialidades: EspecialidadeRef[];
  services: ServiceRef[];
  serviceType: ServiceType;
  amenities: AmenityId[];
  created_at: string;
  updated_at: string;
}

export interface UnitListResponse {
  items: UnitDTO[];
  total: number;
}

// ============================================================================
// Complete Onboarding Data
// ============================================================================

export interface OnboardingSubmitData {
  // Organization
  businessName: string;

  // Unit
  unitName: string;
  brandColor: string;
  logo?: string;
  gallery: string[];
  whatsapp: string;
  phone?: string;
  address: Address;
  especialidades: EspecialidadeRef[];
  services: ServiceRef[];
  serviceType: ServiceType;
  amenities: AmenityId[];
  // Availability is now defined through availability_rules and availability_exceptions
  availability_rules?: AvailabilityRuleInput[];
  availability_exceptions?: AvailabilityExceptionInput[];
}

export interface OnboardingResult {
  organization: OrganizationDTO;
  unit: UnitDTO;
}
