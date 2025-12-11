export interface UnitAmenityDTO {
  id: string;
  unit_id: string;
  amenity_id: string;
  created_at: Date;
}

export interface UnitAmenityWithDetailsDTO {
  id: string;
  unit_id: string;
  amenity: {
    id: string;
    code: string;
    name: string;
    icon: string;
    description?: string;
  };
  created_at: Date;
}
