export interface UnitService {
  id: string;
  unit_id: string;
  service_id: string;
  custom_price_cents?: number;
  custom_duration_minutes?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UnitServiceWithDetails {
  id: string;
  unit_id: string;
  service: {
    id: string;
    code: string;
    name: string;
    description?: string;
    default_duration_minutes: number;
    default_price_cents: number;
    specialty: {
      id: string;
      code: string;
      name: string;
      icon: string;
    };
  };
  custom_price_cents?: number;
  custom_duration_minutes?: number;
  final_price_cents: number;
  final_duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddUnitServicePayload {
  service_id: string;
  custom_price_cents?: number;
  custom_duration_minutes?: number;
}

export interface UpdateUnitServicePayload {
  custom_price_cents?: number | null;
  custom_duration_minutes?: number | null;
  is_active?: boolean;
}

export interface CursorPaginatedResponse<T> {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
}

export type UnitServicesResponse = CursorPaginatedResponse<UnitServiceWithDetails>;
