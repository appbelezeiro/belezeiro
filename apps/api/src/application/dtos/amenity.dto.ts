export interface AmenityDTO {
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

export interface AmenitySummaryDTO {
  id: string;
  code: string;
  name: string;
  icon: string;
}
