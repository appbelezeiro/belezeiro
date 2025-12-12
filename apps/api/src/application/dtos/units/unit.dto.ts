import type { UnitServiceType } from '@/domain/entities/units/unit.entity.types';

type UnitPreferences = {
  palletColor?: string;
};

export interface AddressDTO {
  id: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  complement?: string;
  reference?: string;
  latitude?: number;
  longitude?: number;
  formatted: string;
}

export interface PhoneDTO {
  id: string;
  country_code: string;
  area_code: string;
  number: string;
  full_number: string;
  label?: string;
  is_whatsapp: boolean;
  is_verified: boolean;
}

export interface SpecialtyDTO {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon: string;
  is_predefined: boolean;
  is_active: boolean;
}

export interface ServiceDTO {
  id: string;
  specialty_id: string;
  code: string;
  name: string;
  description?: string;
  default_duration_minutes: number;
  default_price_cents: number;
  is_predefined: boolean;
  is_active: boolean;
}

export interface AmenityDTO {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon: string;
  is_predefined: boolean;
  is_active: boolean;
}

export interface UnitDTO {
  id: string;
  orgId: string;
  name: string;
  preferences: Partial<UnitPreferences>;
  logo?: string;
  gallery: string[];
  active: boolean;
  phones: PhoneDTO[];
  address: AddressDTO | null;
  especialidades: SpecialtyDTO[];
  services: ServiceDTO[];
  serviceType: UnitServiceType;
  amenities: AmenityDTO[];
  created_at: Date;
  updated_at: Date;
}

export interface UnitSummaryDTO {
  id: string;
  orgId: string;
  name: string;
  logo?: string;
  active: boolean;
  serviceType: UnitServiceType;
}

export interface UnitListItemDTO {
  id: string;
  name: string;
  logo?: string;
  active: boolean;
  address: {
    city: string;
    state: string;
  };
}

export type { UnitServiceType, UnitPreferences };
