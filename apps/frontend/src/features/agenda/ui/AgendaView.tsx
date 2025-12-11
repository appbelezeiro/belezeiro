import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/features/dashboard/ui/DashboardHeader";
import { useAgenda } from "../hooks/useAgenda";
import { AgendaHeader } from "./AgendaHeader";
import { AgendaFilters } from "./AgendaFilters";
import { TimeGrid } from "./TimeGrid";
import { MobileDateDisplay } from "./MobileDateDisplay";
import { AppointmentDetailSheet } from "./AppointmentDetailSheet";

export function AgendaView() {
  const {
    selectedDate,
    filters,
    appointments,
    blockedTimes,
    workShift,
    selectedAppointment,
    isDetailSheetOpen,
    handlePreviousDay,
    handleNextDay,
    handleToday,
    handleProfessionalChange,
    handleServiceChange,
    handleShowOnlyConfirmedChange,
    handleClearFilters,
    handleAppointmentClick,
    handleAppointmentDrop,
    handleCloseDetailSheet,
    handleConfirmAppointment,
    handleEditAppointment,
    handleRescheduleAppointment,
    handleCancelAppointment,
    handleWhatsAppAppointment,
    handleCreateAppointment,
    handleRescheduleMultiple,
    handleCancelMultiple,
    handleConfirmAllPending,
    handleSendBulkReminder,
    handleBlockTime,
  } = useAgenda();

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
          selectedProfessional={filters.selectedProfessional}
          selectedService={filters.selectedService}
          showOnlyConfirmed={filters.showOnlyConfirmed}
          onProfessionalChange={handleProfessionalChange}
          onServiceChange={handleServiceChange}
          onShowOnlyConfirmedChange={handleShowOnlyConfirmedChange}
          onClearFilters={handleClearFilters}
        />

        <TimeGrid
          appointments={appointments}
          blockedTimes={blockedTimes}
          workShift={workShift}
          onAppointmentClick={handleAppointmentClick}
          onAppointmentDrop={handleAppointmentDrop}
        />
      </main>

      <Button
        onClick={handleCreateAppointment}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg sm:hidden"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

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
}
