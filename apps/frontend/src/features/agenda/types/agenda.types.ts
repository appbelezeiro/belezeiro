export interface Appointment {
  id: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  clientSince?: string;
  totalAppointments?: number;
  service: string;
  professional: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "pending" | "cancelled";
  price?: number;
  notes?: string;
}

export interface BlockedTime {
  id: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export interface WorkShift {
  startHour: number;
  endHour: number;
}

export interface AgendaFiltersState {
  selectedProfessional: string;
  selectedService: string;
  showOnlyConfirmed: boolean;
}
