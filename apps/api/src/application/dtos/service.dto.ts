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
  created_at: Date;
  updated_at: Date;
}

export interface ServiceWithSpecialtyDTO extends ServiceDTO {
  specialty: {
    id: string;
    code: string;
    name: string;
    icon: string;
  };
}

export interface ServiceSummaryDTO {
  id: string;
  code: string;
  name: string;
  default_duration_minutes: number;
  default_price_cents: number;
}
