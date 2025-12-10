export interface BookingRuleDTO {
  id: string;
  user_id: string;
  type: 'weekly' | 'specific_date';
  weekday?: number;
  date?: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  metadata?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface BookingRuleListItemDTO {
  id: string;
  type: 'weekly' | 'specific_date';
  weekday?: number;
  date?: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
}
