import { Clock, X, Check, CalendarCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DayHours {
  isOpen: boolean;
  start: string | null;
  end: string | null;
  lunchStart: string | null;
  lunchEnd: string | null;
}

interface PublicHoursProps {
  hours: Record<string, DayHours>;
}

const dayLabels: Record<string, string> = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

// Mock availability data - would come from API
const getAvailability = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric" });
  };

  // Simulated availability
  return [
    { date: "Hoje", fullDate: formatDate(today), slots: 3 },
    { date: "Amanhã", fullDate: formatDate(tomorrow), slots: 5 },
  ];
};

export const PublicHours = ({ hours }: PublicHoursProps) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const availability = getAvailability();

  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Horários de Funcionamento</h2>
        </div>
        <p className="text-muted-foreground text-center mb-8">
          Confira nossos horários de atendimento
        </p>

        {/* Availability Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {availability.map((day) => (
            <div
              key={day.date}
              className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 text-center group hover:border-primary/40 transition-colors cursor-pointer"
            >
              <div className="absolute top-2 right-2">
                <Sparkles className="h-4 w-4 text-primary/40" />
              </div>
              <p className="text-xs text-muted-foreground capitalize">{day.fullDate}</p>
              <p className="text-2xl font-bold text-primary mt-1">{day.slots}</p>
              <p className="text-sm text-foreground font-medium">
                {day.slots === 1 ? "horário disponível" : "horários disponíveis"}
              </p>
              <p className="text-xs text-primary font-semibold mt-1">{day.date}</p>
            </div>
          ))}
        </div>

        {/* Quick CTA */}
        <div className="flex justify-center mb-6">
          <Button className="gap-2">
            <CalendarCheck className="h-4 w-4" />
            Reservar horário agora
          </Button>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {dayOrder.map((day, index) => {
            const dayHours = hours[day];
            const isToday = day === today;
            
            return (
              <div
                key={day}
                className={cn(
                  "flex items-center justify-between p-4",
                  index !== dayOrder.length - 1 && "border-b border-border",
                  isToday && "bg-primary/5"
                )}
              >
                <div className="flex items-center gap-3">
                  {isToday && (
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                  <span className={cn(
                    "font-medium",
                    isToday ? "text-primary" : "text-foreground"
                  )}>
                    {dayLabels[day]}
                  </span>
                </div>
                
                {dayHours.isOpen ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-foreground">
                      {dayHours.start} - {dayHours.end}
                    </span>
                    {dayHours.lunchStart && dayHours.lunchEnd && (
                      <span className="text-muted-foreground text-xs">
                        (almoço: {dayHours.lunchStart} - {dayHours.lunchEnd})
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <X className="h-4 w-4 text-destructive" />
                    <span>Fechado</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
