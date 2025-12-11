export interface UnitSpecialtyDTO {
  id: string;
  unit_id: string;
  specialty_id: string;
  created_at: Date;
}

export interface UnitSpecialtyWithDetailsDTO {
  id: string;
  unit_id: string;
  specialty: {
    id: string;
    code: string;
    name: string;
    icon: string;
    description?: string;
  };
  created_at: Date;
}
