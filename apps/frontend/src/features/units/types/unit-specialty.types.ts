export interface UnitSpecialty {
  id: string;
  unit_id: string;
  specialty_id: string;
  created_at: string;
}

export interface UnitSpecialtyWithDetails {
  id: string;
  unit_id: string;
  specialty: {
    id: string;
    code: string;
    name: string;
    icon: string;
    description?: string;
  };
  created_at: string;
}

export interface LinkUnitSpecialtyPayload {
  specialty_id: string;
}

export interface UnitSpecialtiesResponse {
  items: UnitSpecialtyWithDetails[];
}
