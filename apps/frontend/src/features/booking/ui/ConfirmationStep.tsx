// ============================================================================
// CONFIRMATION STEP - Step to Confirm Booking
// ============================================================================

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardCheck,
  ArrowLeft,
  Check,
  Loader2,
  Calendar,
  Clock,
  User,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { BookingFormData } from "../types";

interface ConfirmationStepProps {
  formData: BookingFormData;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function ConfirmationStep({
  formData,
  onConfirm,
  onBack,
  isLoading = false,
  error,
}: ConfirmationStepProps) {
  const totalPrice = formData.selectedServices.reduce(
    (acc, s) => acc + s.price,
    0
  );
  const totalDuration = formData.selectedServices.reduce(
    (acc, s) => acc + s.duration,
    0
  );

  const formatPhone = (p: string) => {
    if (p.length === 11) {
      return `(${p.slice(0, 2)}) ${p.slice(2, 7)}-${p.slice(7)}`;
    }
    return p;
  };

  // Use name from form data or a default for existing clients
  const clientName = formData.clientName || "Cliente";

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <ClipboardCheck className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Confirme seu agendamento</CardTitle>
        <CardDescription className="text-base">
          Revise os detalhes antes de confirmar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Client Info */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{clientName}</p>
              <p className="text-sm text-muted-foreground">
                {formatPhone(formData.phone)}
              </p>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span>
              {format(formData.selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span>
              {formData.selectedTime?.time} • {totalDuration} min
            </span>
          </div>
        </div>

        {/* Services */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">
            Serviços
          </h4>
          {formData.selectedServices.map((service) => (
            <div key={service.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-muted-foreground">
                  {service.duration} min
                </p>
              </div>
              <span className="font-medium">R$ {service.price}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Total</span>
          </div>
          <span className="text-xl font-bold">R$ {totalPrice}</span>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          O pagamento será realizado no local após o atendimento
        </p>

        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12"
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <Button
            type="button"
            className="flex-1 h-12"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Confirmando...
              </>
            ) : (
              <>
                Concluir
                <Check className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
