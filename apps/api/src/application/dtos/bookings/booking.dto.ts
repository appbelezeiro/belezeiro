export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface BookingDTO {
  id: string;
  user_id: string;
  client_id: string;
  unit_id: string;
  service_id?: string;
  price_cents?: number;
  notes?: string;
  start_at: string;
  end_at: string;
  status: BookingStatus;
  created_at: Date;
  updated_at: Date;
}

export interface BookingListItemDTO {
  id: string;
  client_id: string;
  start_at: string;
  end_at: string;
  status: BookingStatus;
}
