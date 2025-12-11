// ============================================================================
// UNIT AVAILABILITY TYPES - Tipos para regras de disponibilidade de unidades
// ============================================================================

// ============================================================================
// Availability Rule Types
// ============================================================================

export type AvailabilityRuleType = 'weekly' | 'specific_date';

export interface AvailabilityRuleInput {
  type: AvailabilityRuleType;
  weekday?: number; // 0-6 (Sunday-Saturday)
  date?: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  slot_duration_minutes: number;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export interface AvailabilityRuleDTO {
  id: string;
  unit_id: string;
  type: AvailabilityRuleType;
  weekday?: number;
  date?: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateAvailabilityRuleRequest {
  unit_id: string;
  type: AvailabilityRuleType;
  weekday?: number;
  date?: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export interface BulkCreateAvailabilityRulesRequest {
  unit_id: string;
  rules: Omit<AvailabilityRuleInput, 'unit_id'>[];
}

export interface UpdateAvailabilityRuleRequest {
  start_time?: string;
  end_time?: string;
  slot_duration_minutes?: number;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export interface AvailabilityRuleListResponse {
  items: AvailabilityRuleDTO[];
  total: number;
}

// ============================================================================
// Availability Exception Types
// ============================================================================

export type AvailabilityExceptionType = 'block' | 'override';

export interface AvailabilityExceptionInput {
  date: string; // YYYY-MM-DD
  type: AvailabilityExceptionType;
  start_time?: string; // HH:MM (required for 'override', not allowed for 'block')
  end_time?: string; // HH:MM (required for 'override', not allowed for 'block')
  slot_duration_minutes?: number; // required for 'override', not allowed for 'block'
  reason?: string;
}

export interface AvailabilityExceptionDTO {
  id: string;
  unit_id: string;
  date: string;
  type: AvailabilityExceptionType;
  start_time?: string;
  end_time?: string;
  slot_duration_minutes?: number;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAvailabilityExceptionRequest {
  unit_id: string;
  date: string;
  type: AvailabilityExceptionType;
  start_time?: string;
  end_time?: string;
  slot_duration_minutes?: number;
  reason?: string;
}

export interface BulkCreateAvailabilityExceptionsRequest {
  unit_id: string;
  exceptions: Omit<AvailabilityExceptionInput, 'unit_id'>[];
}

export interface UpdateAvailabilityExceptionRequest {
  start_time?: string;
  end_time?: string;
  slot_duration_minutes?: number;
  reason?: string;
}

export interface AvailabilityExceptionListResponse {
  items: AvailabilityExceptionDTO[];
  total: number;
}

// ============================================================================
// Available Slots Types
// ============================================================================

export interface AvailableSlot {
  start_time: string; // HH:MM
  end_time: string; // HH:MM
}

export interface AvailableSlotsResponse {
  slots: AvailableSlot[];
}

// ============================================================================
// Helper Types for UI
// ============================================================================

export const WEEKDAY_NAMES: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
};

export const WEEKDAY_NAMES_SHORT: Record<number, string> = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
};
