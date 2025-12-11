export interface UnitServiceDTO {
  id: string;
  unit_id: string;
  service_id: string;
  custom_price_cents?: number;
  custom_duration_minutes?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UnitServiceWithDetailsDTO {
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
  created_at: Date;
  updated_at: Date;
}
