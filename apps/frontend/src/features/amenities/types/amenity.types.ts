export interface Amenity {
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

export interface CreateAmenityPayload {
  code: string;
  name: string;
  description?: string;
  icon: string;
}

export interface UpdateAmenityPayload {
  name?: string;
  description?: string;
  icon?: string;
}

export interface UnitAmenityWithDetails {
  id: string;
  unit_id: string;
  amenity: {
    id: string;
    code: string;
    name: string;
    icon: string;
    description?: string;
  };
  created_at: string;
}

export type AmenitiesResponse = {
  items: Amenity[];
  next_cursor: string | null;
  has_more: boolean;
};
