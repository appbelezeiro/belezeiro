export interface BookingDTO {
  id: string;
  user_id: string;
  client_id: string;
  start_at: string;
  end_at: string;
  status: 'confirmed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface BookingListItemDTO {
  id: string;
  client_id: string;
  start_at: string;
  end_at: string;
  status: 'confirmed' | 'cancelled';
}
