import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Clock, MapPin, Home } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookingData } from "@/pages/PublicBooking";

interface BookingSuccessProps {
  bookingData: BookingData;
  onReset: () => void;
}

export function BookingSuccess({ bookingData, onReset }: BookingSuccessProps) {
  const totalDuration = bookingData.selectedServices.reduce((acc, s) => acc + s.duration, 0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl">Agendamento confirmado!</CardTitle>
        <CardDescription className="text-base">
          Você receberá uma confirmação no WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Booking Summary */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">
                {format(bookingData.selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground">
                às {bookingData.selectedTime?.time}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Duração estimada</p>
              <p className="text-sm text-muted-foreground">{totalDuration} minutos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Studio Julia Alves</p>
              <p className="text-sm text-muted-foreground">Av. Paulista, 1000 - Sala 101</p>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Serviços agendados</h4>
          <div className="space-y-1">
            {bookingData.selectedServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between text-sm">
                <span>{service.name}</span>
                <span className="text-muted-foreground">R$ {service.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => {
              // Mock: Add to calendar
              alert("Adicionar ao calendário (mock)");
            }}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Adicionar ao calendário
          </Button>
          
          <Button
            className="w-full h-12"
            onClick={onReset}
          >
            <Home className="w-5 h-5 mr-2" />
            Voltar ao início
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground pt-2">
          Caso precise reagendar ou cancelar, entre em contato pelo WhatsApp.
        </p>
      </CardContent>
    </Card>
  );
}
