import { useState, useEffect } from "react";
import { MapPin, User, Clock, Calendar, Scissors, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { BookingData, BookingStep } from "@/pages/PublicBooking";

interface BookingSummaryProps {
  unitName: string;
  unitAddress: string;
  unitImages: string[];
  bookingData: BookingData;
  currentStep: BookingStep;
  primaryColor: string;
}

export const BookingSummary = ({
  unitName,
  unitAddress,
  unitImages,
  bookingData,
  currentStep,
  primaryColor,
}: BookingSummaryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const hasClientInfo = bookingData.clientName || bookingData.phone;
  const hasServices = bookingData.selectedServices.length > 0;
  const hasTime = bookingData.selectedTime;
  
  const totalPrice = bookingData.selectedServices.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = bookingData.selectedServices.reduce((acc, s) => acc + s.duration, 0);

  // Auto-slide carousel
  useEffect(() => {
    if (unitImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % unitImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [unitImages.length]);

  const isStepComplete = (step: string) => {
    const stepOrder: BookingStep[] = [
      "PHONE_INPUT",
      "OTP_VERIFICATION", 
      "REGISTRATION",
      "SERVICE_SELECTION",
      "TIME_SELECTION",
      "CONFIRMATION",
      "SUCCESS"
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step as BookingStep);
    return stepIndex < currentIndex;
  };

  return (
    <div className="sticky top-24">
      {/* Image Carousel */}
      {unitImages.length > 0 && (
        <div className="relative h-40 rounded-xl overflow-hidden mb-6">
          {unitImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Unidade"
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          {/* Dots */}
          {unitImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {unitImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === currentImageIndex 
                      ? "bg-white w-4" 
                      : "bg-white/50 w-1.5"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Unit Info */}
      <div className="flex items-start gap-3 mb-6">
        <div 
          className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
          style={{ backgroundColor: primaryColor }}
        >
          {unitName.charAt(0)}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Você está agendando em</p>
          <p className="font-semibold text-foreground">{unitName}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            <span>{unitAddress}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border mb-6" />

      {/* Client Info */}
      <SummarySection
        icon={User}
        title="Cliente"
        isComplete={isStepComplete("REGISTRATION")}
        isEmpty={!hasClientInfo}
        emptyText="Aguardando identificação..."
      >
        {hasClientInfo && (
          <div>
            {bookingData.clientName && (
              <p className="font-medium text-foreground">
                Bem-vindo(a), {bookingData.clientName.split(" ")[0]}! 👋
              </p>
            )}
            <p className="text-sm text-muted-foreground">{bookingData.phone}</p>
          </div>
        )}
      </SummarySection>

      <div className="h-px bg-border my-5" />

      {/* Services */}
      <SummarySection
        icon={Scissors}
        title="Serviços"
        isComplete={isStepComplete("SERVICE_SELECTION")}
        isEmpty={!hasServices}
        emptyText="Nenhum serviço selecionado"
      >
        {hasServices && (
          <div className="space-y-1.5">
            {bookingData.selectedServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{service.name}</span>
                <span className="text-muted-foreground">
                  R$ {service.price.toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {totalDuration} min
              </span>
              <span className="font-semibold text-foreground">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </SummarySection>

      <div className="h-px bg-border my-5" />

      {/* Date & Time */}
      <SummarySection
        icon={Calendar}
        title="Data e Horário"
        isComplete={isStepComplete("TIME_SELECTION")}
        isEmpty={!hasTime}
        emptyText="Aguardando seleção..."
      >
        {hasTime && (
          <div>
            <p className="font-medium text-foreground capitalize">
              {format(bookingData.selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{bookingData.selectedTime?.time}</span>
            </div>
          </div>
        )}
      </SummarySection>

      {/* Status indicator */}
      {(currentStep === "CONFIRMATION" || currentStep === "SUCCESS") && (
        <>
          <div className="h-px bg-border my-5" />
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className={cn(
              "h-4 w-4",
              currentStep === "SUCCESS" ? "text-emerald-500" : "text-primary"
            )} />
            <span className={cn(
              "font-medium",
              currentStep === "SUCCESS" ? "text-emerald-600" : "text-primary"
            )}>
              {currentStep === "SUCCESS" ? "Agendamento confirmado!" : "Revise e confirme"}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

// Summary Section Component
interface SummarySectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  isComplete: boolean;
  isEmpty: boolean;
  emptyText: string;
  children: React.ReactNode;
}

const SummarySection = ({
  icon: Icon,
  title,
  isComplete,
  isEmpty,
  emptyText,
  children,
}: SummarySectionProps) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <Icon className={cn(
        "h-4 w-4",
        isComplete ? "text-primary" : "text-muted-foreground"
      )} />
      <span className={cn(
        "text-sm font-medium",
        isComplete ? "text-primary" : "text-muted-foreground"
      )}>
        {title}
      </span>
      {isComplete && (
        <CheckCircle2 className="h-3.5 w-3.5 text-primary ml-auto" />
      )}
    </div>
    <div className="pl-6">
      {isEmpty ? (
        <p className="text-sm text-muted-foreground/60 italic">{emptyText}</p>
      ) : (
        children
      )}
    </div>
  </div>
);
