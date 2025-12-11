import { useState, useMemo, useCallback } from "react";
import { addDays, subDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { Appointment, BlockedTime, WorkShift, AgendaFiltersState } from "../types";

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "Maria Santos",
    clientPhone: "(11) 99999-1234",
    clientEmail: "maria.santos@email.com",
    clientSince: "Jan/2024",
    totalAppointments: 15,
    service: "Corte de Cabelo",
    professional: "João Santos",
    startTime: "09:00",
    endTime: "10:00",
    status: "confirmed",
    price: 80,
    notes: "Corte curto, como da última vez",
  },
  {
    id: "2",
    clientName: "Ana Oliveira",
    clientPhone: "(11) 98888-5678",
    clientEmail: "ana.oliveira@email.com",
    clientSince: "Mar/2024",
    totalAppointments: 8,
    service: "Coloração",
    professional: "Maria Silva",
    startTime: "09:30",
    endTime: "11:30",
    status: "pending",
    price: 150,
  },
  {
    id: "3",
    clientName: "Carlos Lima",
    clientPhone: "(11) 97777-9012",
    clientEmail: "carlos.lima@email.com",
    clientSince: "Jun/2023",
    totalAppointments: 24,
    service: "Manicure",
    professional: "Ana Oliveira",
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed",
    price: 45,
  },
  {
    id: "4",
    clientName: "Beatriz Costa",
    clientPhone: "(11) 96666-3456",
    clientEmail: "beatriz.costa@email.com",
    clientSince: "Set/2024",
    totalAppointments: 3,
    service: "Pedicure",
    professional: "João Santos",
    startTime: "14:00",
    endTime: "15:30",
    status: "confirmed",
    price: 55,
  },
  {
    id: "5",
    clientName: "Roberto Alves",
    clientPhone: "(11) 95555-7890",
    clientEmail: "roberto.alves@email.com",
    clientSince: "Fev/2024",
    totalAppointments: 6,
    service: "Corte de Cabelo",
    professional: "Maria Silva",
    startTime: "14:00",
    endTime: "14:30",
    status: "cancelled",
    price: 80,
  },
  {
    id: "6",
    clientName: "Fernanda Souza",
    clientPhone: "(11) 94444-2345",
    clientEmail: "fernanda.souza@email.com",
    clientSince: "Nov/2023",
    totalAppointments: 18,
    service: "Coloração",
    professional: "Ana Oliveira",
    startTime: "16:00",
    endTime: "18:00",
    status: "pending",
    price: 180,
    notes: "Mechas loiras, trazer referência",
  },
];

// Mock blocked times
const mockBlockedTimes: BlockedTime[] = [
  { id: "block1", startTime: "12:00", endTime: "13:00", reason: "Almoço" },
  { id: "block2", startTime: "18:30", endTime: "19:00", reason: "Intervalo" },
];

// Work shift configuration
const workShift: WorkShift = {
  startHour: 9,
  endHour: 20,
};

export function useAgenda() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState<AgendaFiltersState>({
    selectedProfessional: "all",
    selectedService: "all",
    showOnlyConfirmed: false,
  });

  // Appointment state
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  // Navigation handlers
  const handlePreviousDay = useCallback(() => {
    setSelectedDate((prev) => subDays(prev, 1));
  }, []);

  const handleNextDay = useCallback(() => {
    setSelectedDate((prev) => addDays(prev, 1));
  }, []);

  const handleToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  // Appointment handlers
  const handleAppointmentClick = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailSheetOpen(true);
  }, []);

  const handleCloseDetailSheet = useCallback(() => {
    setIsDetailSheetOpen(false);
    setSelectedAppointment(null);
  }, []);

  // Calculate new end time based on duration
  const calculateNewEndTime = (apt: Appointment, newStartTime: string) => {
    const [oldStartH, oldStartM] = apt.startTime.split(":").map(Number);
    const [oldEndH, oldEndM] = apt.endTime.split(":").map(Number);
    const durationMinutes = (oldEndH * 60 + oldEndM) - (oldStartH * 60 + oldStartM);

    const [newStartH, newStartM] = newStartTime.split(":").map(Number);
    const newEndMinutes = newStartH * 60 + newStartM + durationMinutes;
    const newEndH = Math.floor(newEndMinutes / 60);
    const newEndM = newEndMinutes % 60;

    return `${newEndH.toString().padStart(2, "0")}:${newEndM.toString().padStart(2, "0")}`;
  };

  const handleAppointmentDrop = useCallback((appointmentId: string, newStartTime: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? { ...apt, startTime: newStartTime, endTime: calculateNewEndTime(apt, newStartTime) }
          : apt
      )
    );
    toast({
      title: "Horário alterado!",
      description: `Agendamento movido para ${newStartTime}`,
    });
  }, [toast]);

  // Filter handlers
  const handleProfessionalChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, selectedProfessional: value }));
  }, []);

  const handleServiceChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, selectedService: value }));
  }, []);

  const handleShowOnlyConfirmedChange = useCallback((value: boolean) => {
    setFilters((prev) => ({ ...prev, showOnlyConfirmed: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      selectedProfessional: "all",
      selectedService: "all",
      showOnlyConfirmed: false,
    });
  }, []);

  // Action handlers for detail sheet
  const handleConfirmAppointment = useCallback((id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "confirmed" as const } : apt))
    );
    toast({ title: "Agendamento confirmado!" });
    handleCloseDetailSheet();
  }, [toast, handleCloseDetailSheet]);

  const handleEditAppointment = useCallback((id: string) => {
    toast({ title: "Editar agendamento", description: "Funcionalidade em desenvolvimento." });
  }, [toast]);

  const handleRescheduleAppointment = useCallback((id: string) => {
    toast({ title: "Remarcar agendamento", description: "Funcionalidade em desenvolvimento." });
  }, [toast]);

  const handleCancelAppointment = useCallback((id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "cancelled" as const } : apt))
    );
    toast({ title: "Agendamento cancelado", variant: "destructive" });
    handleCloseDetailSheet();
  }, [toast, handleCloseDetailSheet]);

  const handleWhatsAppAppointment = useCallback((id: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (apt?.clientPhone) {
      const phone = apt.clientPhone.replace(/\D/g, "");
      window.open(`https://wa.me/55${phone}`, "_blank");
    }
  }, [appointments]);

  // Bulk action handlers
  const handleRescheduleMultiple = useCallback(() => {
    toast({ title: "Reagendar múltiplos", description: "Funcionalidade em desenvolvimento." });
  }, [toast]);

  const handleCancelMultiple = useCallback(() => {
    toast({ title: "Cancelar múltiplos", description: "Funcionalidade em desenvolvimento." });
  }, [toast]);

  const handleConfirmAllPending = useCallback(() => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.status === "pending" ? { ...apt, status: "confirmed" as const } : apt))
    );
    toast({ title: "Todos os pendentes foram confirmados!" });
  }, [toast]);

  const handleSendBulkReminder = useCallback(() => {
    toast({ title: "Enviando lembretes", description: "Funcionalidade em desenvolvimento." });
  }, [toast]);

  const handleBlockTime = useCallback(() => {
    toast({ title: "Bloquear horário", description: "Funcionalidade em desenvolvimento." });
  }, [toast]);

  const handleCreateAppointment = useCallback(() => {
    toast({ title: "Criar agendamento", description: "Funcionalidade em desenvolvimento." });
  }, [toast]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (filters.selectedProfessional !== "all") {
        const profMap: Record<string, string> = {
          "1": "Maria Silva",
          "2": "João Santos",
          "3": "Ana Oliveira",
        };
        if (apt.professional !== profMap[filters.selectedProfessional]) return false;
      }

      if (filters.selectedService !== "all") {
        const serviceMap: Record<string, string> = {
          "1": "Corte de Cabelo",
          "2": "Coloração",
          "3": "Manicure",
          "4": "Pedicure",
        };
        if (apt.service !== serviceMap[filters.selectedService]) return false;
      }

      if (filters.showOnlyConfirmed && apt.status !== "confirmed") return false;

      return true;
    });
  }, [appointments, filters]);

  return {
    // State
    selectedDate,
    filters,
    appointments: filteredAppointments,
    blockedTimes: mockBlockedTimes,
    workShift,
    selectedAppointment,
    isDetailSheetOpen,

    // Navigation
    handlePreviousDay,
    handleNextDay,
    handleToday,

    // Filters
    handleProfessionalChange,
    handleServiceChange,
    handleShowOnlyConfirmedChange,
    handleClearFilters,

    // Appointment actions
    handleAppointmentClick,
    handleAppointmentDrop,
    handleCloseDetailSheet,
    handleConfirmAppointment,
    handleEditAppointment,
    handleRescheduleAppointment,
    handleCancelAppointment,
    handleWhatsAppAppointment,
    handleCreateAppointment,

    // Bulk actions
    handleRescheduleMultiple,
    handleCancelMultiple,
    handleConfirmAllPending,
    handleSendBulkReminder,
    handleBlockTime,
  };
}
