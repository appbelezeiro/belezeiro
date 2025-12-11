export interface Specialty {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon: string;
  is_predefined: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SpecialtySummary {
  id: string;
  code: string;
  name: string;
  icon: string;
}

export interface CreateSpecialtyPayload {
  code: string;
  name: string;
  description?: string;
  icon: string;
}

export interface CursorPaginatedResponse<T> {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
}

export type SpecialtiesResponse = CursorPaginatedResponse<Specialty>;
