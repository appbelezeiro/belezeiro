import type {
  DayOfWeek,
  DaySchedule,
  ServiceType,
  Address,
  EspecialidadeRef,
  ServiceRef,
  LunchBreak,
  WorkingHours,
  Subscription,
} from '@/domain/entities/units/unit.entity';
import type { AmenityId } from '@/domain/constants/amenities';

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
  workingHours: WorkingHours;
  lunchBreak?: LunchBreak;
  created_at: Date;
  updated_at: Date;
}

export interface UnitSummaryDTO {
  id: string;
  organizationId: string;
  name: string;
  logo?: string;
  isActive: boolean;
  serviceType: ServiceType;
}

export interface UnitListItemDTO {
  id: string;
  name: string;
  logo?: string;
  isActive: boolean;
  address: {
    city: string;
    state: string;
  };
}

export type {
  DayOfWeek,
  DaySchedule,
  ServiceType,
  Address,
  EspecialidadeRef,
  ServiceRef,
  LunchBreak,
  WorkingHours,
};
