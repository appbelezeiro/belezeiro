export interface Service {
  id: string;
  specialty_id: string;
  code: string;
  name: string;
  description?: string;
  default_duration_minutes: number;
  default_price_cents: number;
  is_predefined: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceWithSpecialty extends Service {
  specialty: {
    id: string;
    code: string;
    name: string;
    icon: string;
  };
}

export interface CreateServicePayload {
  specialty_id: string;
  code: string;
  name: string;
  description?: string;
  default_duration_minutes: number;
  default_price_cents: number;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  default_duration_minutes?: number;
  default_price_cents?: number;
  is_active?: boolean;
}

export interface CursorPaginatedResponse<T> {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
}

export type ServicesResponse = CursorPaginatedResponse<Service>;
