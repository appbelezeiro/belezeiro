export interface BookingExceptionDTO {
  id: string;
  user_id: string;
  date: string;
  type: 'block' | 'override';
  start_time?: string;
  end_time?: string;
  slot_duration_minutes?: number;
  reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface BookingExceptionListItemDTO {
  id: string;
  date: string;
  type: 'block' | 'override';
  start_time?: string;
  end_time?: string;
  reason?: string;
}
