import { useState, useMemo } from "react";
import { addDays, subDays } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AgendaHeader } from "@/components/agenda/AgendaHeader";
import { AgendaFilters } from "@/components/agenda/AgendaFilters";
import { TimeGrid, WorkShift } from "@/components/agenda/TimeGrid";
import { MobileDateDisplay } from "@/components/agenda/MobileDateDisplay";
import { AppointmentDetailSheet } from "@/components/agenda/AppointmentDetailSheet";
import { Appointment } from "@/components/agenda/AppointmentCard";
import { BlockedTime } from "@/components/agenda/BlockedTimeSlot";
import { useToast } from "@/hooks/use-toast";

// Mock appointments data with extended info
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

const Agenda = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [showOnlyConfirmed, setShowOnlyConfirmed] = useState(false);
  
  // Appointment state
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  const handlePreviousDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailSheetOpen(true);
  };

  const handleCloseDetailSheet = () => {
    setIsDetailSheetOpen(false);
    setSelectedAppointment(null);
  };

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

  const handleAppointmentDrop = (appointmentId: string, newStartTime: string) => {
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
  };

  const handleClearFilters = () => {
    setSelectedProfessional("all");
    setSelectedService("all");
    setShowOnlyConfirmed(false);
  };

  // Action handlers for detail sheet
  const handleConfirmAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "confirmed" as const } : apt))
    );
    toast({ title: "Agendamento confirmado!" });
    handleCloseDetailSheet();
  };

  const handleEditAppointment = (id: string) => {
    toast({ title: "Editar agendamento", description: "Funcionalidade em desenvolvimento." });
  };

  const handleRescheduleAppointment = (id: string) => {
    toast({ title: "Remarcar agendamento", description: "Funcionalidade em desenvolvimento." });
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "cancelled" as const } : apt))
    );
    toast({ title: "Agendamento cancelado", variant: "destructive" });
    handleCloseDetailSheet();
  };

  const handleWhatsAppAppointment = (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (apt?.clientPhone) {
      const phone = apt.clientPhone.replace(/\D/g, "");
      window.open(`https://wa.me/55${phone}`, "_blank");
    }
  };

  // Bulk action handlers
  const handleRescheduleMultiple = () => {
    toast({ title: "Reagendar múltiplos", description: "Funcionalidade em desenvolvimento." });
  };

  const handleCancelMultiple = () => {
    toast({ title: "Cancelar múltiplos", description: "Funcionalidade em desenvolvimento." });
  };

  const handleConfirmAllPending = () => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.status === "pending" ? { ...apt, status: "confirmed" as const } : apt))
    );
    toast({ title: "Todos os pendentes foram confirmados!" });
  };

  const handleSendBulkReminder = () => {
    toast({ title: "Enviando lembretes", description: "Funcionalidade em desenvolvimento." });
  };

  const handleBlockTime = () => {
    toast({ title: "Bloquear horário", description: "Funcionalidade em desenvolvimento." });
  };

  const handleCreateAppointment = () => {
    toast({ title: "Criar agendamento", description: "Funcionalidade em desenvolvimento." });
  };

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (selectedProfessional !== "all") {
        const profMap: Record<string, string> = {
          "1": "Maria Silva",
          "2": "João Santos",
          "3": "Ana Oliveira",
        };
        if (apt.professional !== profMap[selectedProfessional]) return false;
      }

      if (selectedService !== "all") {
        const serviceMap: Record<string, string> = {
          "1": "Corte de Cabelo",
          "2": "Coloração",
          "3": "Manicure",
          "4": "Pedicure",
        };
        if (apt.service !== serviceMap[selectedService]) return false;
      }

      if (showOnlyConfirmed && apt.status !== "confirmed") return false;

      return true;
    });
  }, [appointments, selectedProfessional, selectedService, showOnlyConfirmed]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader activeNav="agenda" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AgendaHeader
          selectedDate={selectedDate}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          onToday={handleToday}
          onRescheduleMultiple={handleRescheduleMultiple}
          onCancelMultiple={handleCancelMultiple}
          onConfirmAllPending={handleConfirmAllPending}
          onSendBulkReminder={handleSendBulkReminder}
          onBlockTime={handleBlockTime}
        />

        <MobileDateDisplay selectedDate={selectedDate} />

        <AgendaFilters
          selectedProfessional={selectedProfessional}
          selectedService={selectedService}
          showOnlyConfirmed={showOnlyConfirmed}
          onProfessionalChange={setSelectedProfessional}
          onServiceChange={setSelectedService}
          onShowOnlyConfirmedChange={setShowOnlyConfirmed}
          onClearFilters={handleClearFilters}
        />

        <TimeGrid
          appointments={filteredAppointments}
          blockedTimes={mockBlockedTimes}
          workShift={workShift}
          onAppointmentClick={handleAppointmentClick}
          onAppointmentDrop={handleAppointmentDrop}
        />
      </main>

      {/* Mobile FAB */}
      <Button
        onClick={handleCreateAppointment}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg sm:hidden"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Appointment Detail Sheet */}
      <AppointmentDetailSheet
        appointment={selectedAppointment}
        isOpen={isDetailSheetOpen}
        onClose={handleCloseDetailSheet}
        onConfirm={handleConfirmAppointment}
        onEdit={handleEditAppointment}
        onReschedule={handleRescheduleAppointment}
        onCancel={handleCancelAppointment}
        onWhatsApp={handleWhatsAppAppointment}
      />
    </div>
  );
};

export default Agenda;
