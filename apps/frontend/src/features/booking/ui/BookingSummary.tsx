// ============================================================================
// BOOKING SUMMARY - Summary Sidebar for Booking Flow
// ============================================================================

import { MapPin, Clock, Calendar, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { BookingStep, BookingFormData, UnitInfo } from "../types";

interface BookingSummaryProps {
  unitInfo?: UnitInfo | null;
  formData: BookingFormData;
  currentStep: BookingStep;
}

export function BookingSummary({
  unitInfo,
  formData,
  currentStep,
}: BookingSummaryProps) {
  const totalPrice = formData.selectedServices.reduce(
    (acc, s) => acc + s.price,
    0
  );
  const totalDuration = formData.selectedServices.reduce(
    (acc, s) => acc + s.duration,
    0
  );

  const showServices =
    currentStep !== "PHONE_INPUT" &&
    currentStep !== "OTP_VERIFICATION" &&
    currentStep !== "REGISTRATION";

  const showDateTime =
    currentStep === "TIME_SELECTION" ||
    currentStep === "CONFIRMATION" ||
    currentStep === "SUCCESS";

  return (
    <div className="sticky top-8 space-y-4">
      {/* Unit Info Card */}
      {unitInfo && (
        <div className="rounded-xl overflow-hidden border bg-card">
          {/* Unit Image */}
          {unitInfo.images?.[0] && (
            <div className="aspect-video relative">
              <img
                src={unitInfo.images[0]}
                alt={`${unitInfo.businessName} - ${unitInfo.unitName}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-semibold">
                  {unitInfo.businessName}
                </h3>
                <p className="text-white/80 text-sm">{unitInfo.unitName}</p>
              </div>
            </div>
          )}

          {/* Unit Address */}
          <div className="p-4">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{unitInfo.address}</span>
            </div>
          </div>
        </div>
      )}

      {/* Booking Summary Card */}
      {showServices && formData.selectedServices.length > 0 && (
        <div className="rounded-xl border bg-card p-4 space-y-4">
          <h4 className="font-semibold">Resumo do Agendamento</h4>

          {/* Selected Services */}
          <div className="space-y-2">
            {formData.selectedServices.map((service) => (
              <div key={service.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{service.name}</span>
                <span>R$ {service.price}</span>
              </div>
            ))}
          </div>

          {/* Date & Time */}
          {showDateTime && formData.selectedTime && (
            <>
              <div className="border-t pt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {format(formData.selectedDate, "d 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{formData.selectedTime.time}</span>
                </div>
              </div>
            </>
          )}

          {/* Total */}
          <div className="border-t pt-3 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Duração
              </span>
              <span>{totalDuration} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                Total
              </span>
              <span className="text-lg font-bold">R$ {totalPrice}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
