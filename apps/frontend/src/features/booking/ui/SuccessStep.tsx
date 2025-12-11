// ============================================================================
// SUCCESS STEP - Booking Confirmation Success
// ============================================================================

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Calendar, Clock, MapPin, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Booking, BookingFormData, UnitInfo } from "../types";

interface SuccessStepProps {
  booking?: Booking | null;
  formData: BookingFormData;
  unitInfo?: UnitInfo | null;
  onNewBooking: () => void;
}

export function SuccessStep({
  booking,
  formData,
  unitInfo,
  onNewBooking,
}: SuccessStepProps) {
  const totalPrice =
    booking?.totalPrice ??
    formData.selectedServices.reduce((acc, s) => acc + s.price, 0);

  const totalDuration =
    booking?.totalDuration ??
    formData.selectedServices.reduce((acc, s) => acc + s.duration, 0);

  const services = booking?.services ?? formData.selectedServices;
  const date = booking ? new Date(booking.date) : formData.selectedDate;
  const time = booking?.time ?? formData.selectedTime?.time;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
        </div>
        <CardTitle className="text-2xl text-green-600 dark:text-green-500">
          Agendamento Confirmado!
        </CardTitle>
        <CardDescription className="text-base">
          Você receberá uma confirmação por SMS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Confirmation Code */}
        {booking?.confirmationCode && (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Código de Confirmação
            </p>
            <p className="text-2xl font-bold font-mono tracking-wider">
              {booking.confirmationCode}
            </p>
          </div>
        )}

        {/* Booking Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Calendar className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">
                {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground">
                {time} • {totalDuration} min
              </p>
            </div>
          </div>

          {unitInfo && (
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">
                  {unitInfo.businessName} - {unitInfo.unitName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {unitInfo.address}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Clock className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="font-medium mb-1">Serviços</p>
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between text-sm text-muted-foreground"
                >
                  <span>{service.name}</span>
                  <span>R$ {service.price}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                <span>Total</span>
                <span>R$ {totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button className="w-full h-12" variant="outline" onClick={onNewBooking}>
            <Plus className="w-5 h-5 mr-2" />
            Fazer outro agendamento
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Você pode cancelar ou reagendar entrando em contato conosco
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
