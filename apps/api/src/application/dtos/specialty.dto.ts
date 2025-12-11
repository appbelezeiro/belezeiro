export interface SpecialtyDTO {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon: string;
  is_predefined: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SpecialtySummaryDTO {
  id: string;
  code: string;
  name: string;
  icon: string;
}
