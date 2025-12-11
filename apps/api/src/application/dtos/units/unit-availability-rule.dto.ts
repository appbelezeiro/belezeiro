export interface UnitAvailabilityRuleDTO {
  id: string;
  unit_id: string;
  type: 'weekly' | 'specific_date';
  weekday?: number;
  date?: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
  metadata?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface UnitAvailabilityRuleListItemDTO {
  id: string;
  type: 'weekly' | 'specific_date';
  weekday?: number;
  date?: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
}
