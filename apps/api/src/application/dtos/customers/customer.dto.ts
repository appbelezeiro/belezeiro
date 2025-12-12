export interface CustomerDTO {
  id: string;
  userId: string;
  unitId: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerWithUserDTO {
  id: string;
  userId: string;
  unitId: string;
  notes?: string;
  created_at: Date;
  user: {
    id: string;
    name: string;
    email: string;
    photo?: string;
  };
}

export interface CreateCustomerDTO {
  userId: string;
  unitId: string;
  notes?: string;
}

export interface UpdateCustomerDTO {
  notes?: string;
}
