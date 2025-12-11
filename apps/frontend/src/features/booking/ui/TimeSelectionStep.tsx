// ============================================================================
// TIME SELECTION STEP - Step to Select Date and Time
// ============================================================================

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import {
  format,
  addDays,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { TimeSlot, DayAvailability } from "../types";

interface TimeSelectionStepProps {
  selectedDate: Date;
  selectedTime: TimeSlot | null;
  totalDuration: number;
  availability?: DayAvailability;
  isLoadingAvailability?: boolean;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: TimeSlot) => void;
  onContinue: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function TimeSelectionStep({
  selectedDate,
  selectedTime,
  totalDuration,
  availability,
  isLoadingAvailability = false,
  onSelectDate,
  onSelectTime,
  onContinue,
  onBack,
  isLoading = false,
}: TimeSelectionStepProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  // Generate week days
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    const startDate = addDays(new Date(), weekOffset * 7);

    for (let i = 0; i < 7; i++) {
      days.push(addDays(startDate, i));
    }

    return days;
  }, [weekOffset]);

  const timeSlots = availability?.slots ?? [];
  const canGoBack = weekOffset > 0;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Escolha o horário</CardTitle>
        <CardDescription className="text-base">
          Duração estimada: {totalDuration} minutos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset((prev) => prev - 1)}
            disabled={!canGoBack}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-medium text-sm">
            {format(weekDays[0], "MMM yyyy", { locale: ptBR })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset((prev) => prev + 1)}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isPast = isBefore(day, startOfDay(new Date()));
            const dayIsToday = isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => !isPast && onSelectDate(day)}
                disabled={isPast}
                className={`
                  p-2 rounded-lg text-center transition-all
                  ${isPast ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-muted"}
                  ${isSelected ? "bg-primary text-primary-foreground" : ""}
                  ${dayIsToday && !isSelected ? "ring-2 ring-primary/30" : ""}
                `}
              >
                <div
                  className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {format(day, "EEE", { locale: ptBR })}
                </div>
                <div className="text-lg font-medium">{format(day, "d")}</div>
              </button>
            );
          })}
        </div>

        {/* Time Slots */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </span>
          </div>

          <ScrollArea className="h-[200px]">
            {isLoadingAvailability ? (
              <div className="grid grid-cols-3 gap-2 pr-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Nenhum horário disponível nesta data
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 pr-4">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTime?.id === slot.id;

                  return (
                    <button
                      key={slot.id}
                      onClick={() => slot.available && onSelectTime(slot)}
                      disabled={!slot.available}
                      className={`
                        py-3 px-2 rounded-lg text-sm font-medium transition-all
                        ${
                          !slot.available
                            ? "bg-muted/50 text-muted-foreground line-through cursor-not-allowed"
                            : isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80 cursor-pointer"
                        }
                      `}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

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
            disabled={!selectedTime || isLoading}
            onClick={onContinue}
          >
            Confirmar
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
