import { useMemo, useState } from "react";
import { DndContext, DragEndEvent, DragMoveEvent, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppointmentCard, Appointment } from "./AppointmentCard";
import { DraggableAppointmentCard } from "./DraggableAppointmentCard";
import { BlockedTimeSlot, BlockedTime } from "./BlockedTimeSlot";
import { WorkShiftIndicator } from "./WorkShiftIndicator";
import { cn } from "@/lib/utils";

export interface WorkShift {
  startHour: number;
  endHour: number;
}

interface TimeGridProps {
  appointments: Appointment[];
  blockedTimes: BlockedTime[];
  workShift: WorkShift;
  onAppointmentClick: (appointment: Appointment) => void;
  onAppointmentDrop: (appointmentId: string, newStartTime: string) => void;
}

const SLOT_HEIGHT = 48;
const START_HOUR = 6;
const END_HOUR = 22;

const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < END_HOUR) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

const calculatePositionStyle = (startTime: string, endTime: string) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const gridStartMinutes = START_HOUR * 60;

  const top = ((startMinutes - gridStartMinutes) / 30) * SLOT_HEIGHT;
  const height = ((endMinutes - startMinutes) / 30) * SLOT_HEIGHT;

  return {
    top: `${top}px`,
    height: `${Math.max(height - 4, SLOT_HEIGHT - 4)}px`,
  };
};

const groupOverlappingAppointments = (appointments: Appointment[]) => {
  const sorted = [...appointments].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  const groups: Appointment[][] = [];
  let currentGroup: Appointment[] = [];
  let currentGroupEnd = 0;

  sorted.forEach((apt) => {
    const aptStart = timeToMinutes(apt.startTime);
    const aptEnd = timeToMinutes(apt.endTime);

    if (currentGroup.length === 0 || aptStart < currentGroupEnd) {
      currentGroup.push(apt);
      currentGroupEnd = Math.max(currentGroupEnd, aptEnd);
    } else {
      groups.push(currentGroup);
      currentGroup = [apt];
      currentGroupEnd = aptEnd;
    }
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
};

const isTimeInBlockedSlot = (time: string, blockedTimes: BlockedTime[]) => {
  const minutes = timeToMinutes(time);
  return blockedTimes.some((bt) => {
    const start = timeToMinutes(bt.startTime);
    const end = timeToMinutes(bt.endTime);
    return minutes >= start && minutes < end;
  });
};

const isTimeOutsideWorkShift = (time: string, workShift: WorkShift) => {
  const minutes = timeToMinutes(time);
  const workStart = workShift.startHour * 60;
  const workEnd = workShift.endHour * 60;
  return minutes < workStart || minutes >= workEnd;
};

// Calculate target time from Y position
const calculateTargetTime = (yOffset: number, originalStartTime: string): string => {
  const originalMinutes = timeToMinutes(originalStartTime);
  const slotsMoved = Math.round(yOffset / SLOT_HEIGHT);
  const newMinutes = originalMinutes + (slotsMoved * 30);
  
  // Clamp to valid range
  const clampedMinutes = Math.max(START_HOUR * 60, Math.min((END_HOUR - 1) * 60 + 30, newMinutes));
  return minutesToTime(clampedMinutes);
};

export const TimeGrid = ({
  appointments,
  blockedTimes,
  workShift,
  onAppointmentClick,
  onAppointmentDrop,
}: TimeGridProps) => {
  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const groupedAppointments = useMemo(
    () => groupOverlappingAppointments(appointments),
    [appointments]
  );
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOverInvalid, setIsOverInvalid] = useState(false);
  const [dragTargetTime, setDragTargetTime] = useState<string | null>(null);

  const activeAppointment = useMemo(
    () => appointments.find((apt) => apt.id === activeId),
    [appointments, activeId]
  );

  // Configure sensor with activation constraint to distinguish click from drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Need to move 8px before drag starts
      },
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    const apt = appointments.find((a) => a.id === event.active.id);
    if (apt) {
      setDragTargetTime(apt.startTime);
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    if (!activeAppointment || !event.delta) return;
    
    const targetTime = calculateTargetTime(event.delta.y, activeAppointment.startTime);
    setDragTargetTime(targetTime);
    
    // Check validity
    const invalid = isTimeInBlockedSlot(targetTime, blockedTimes) || 
                   isTimeOutsideWorkShift(targetTime, workShift);
    setIsOverInvalid(invalid);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const appointmentId = activeId;
    const targetTime = dragTargetTime;
    
    setActiveId(null);
    setIsOverInvalid(false);
    setDragTargetTime(null);

    if (!appointmentId || !targetTime) return;

    // Validate drop target
    if (isTimeInBlockedSlot(targetTime, blockedTimes) || 
        isTimeOutsideWorkShift(targetTime, workShift)) {
      return;
    }

    // Check if actually moved
    const apt = appointments.find((a) => a.id === appointmentId);
    if (apt && apt.startTime !== targetTime) {
      onAppointmentDrop(appointmentId, targetTime);
    }
  };

  // Calculate work shift indicator positions
  const workStartPosition = ((workShift.startHour - START_HOUR) * 2) * SLOT_HEIGHT;
  const workEndPosition = ((workShift.endHour - START_HOUR) * 2) * SLOT_HEIGHT;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="flex-1 bg-background">
        <div className="flex min-h-full">
          {/* Time column with integrated lines */}
          <div className="flex-shrink-0 w-16 sm:w-20 relative">
            {timeSlots.map((time) => {
              const hour = parseInt(time.split(":")[0]);
              const isHalfHour = time.endsWith(":30");
              const isOutsideShift = hour < workShift.startHour || hour >= workShift.endHour;
              
              return (
                <div
                  key={time}
                  className={cn(
                    "relative flex items-center",
                    isOutsideShift && "opacity-40"
                  )}
                  style={{ height: `${SLOT_HEIGHT}px` }}
                >
                  {/* Time label */}
                  <span 
                    className={cn(
                      "font-medium tabular-nums pr-2 text-right w-full",
                      isHalfHour 
                        ? "text-[10px] text-muted-foreground/60" 
                        : "text-xs text-muted-foreground"
                    )}
                  >
                    {time}
                  </span>
                  
                  {/* Horizontal line extending from time to edge */}
                  <div 
                    className={cn(
                      "absolute right-0 w-3 h-px",
                      isHalfHour ? "bg-border/30" : "bg-border"
                    )}
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              );
            })}
          </div>

          {/* Appointments area */}
          <div className="flex-1 relative border-l border-border">
            {/* Grid lines - positioned at the TOP of each slot */}
            {timeSlots.map((time) => {
              const hour = parseInt(time.split(":")[0]);
              const isOutsideShift = hour < workShift.startHour || hour >= workShift.endHour;
              const isBlocked = isTimeInBlockedSlot(time, blockedTimes);
              const isHalfHour = time.endsWith(":30");
              const slotIndex = timeSlots.indexOf(time);
              const topPosition = slotIndex * SLOT_HEIGHT;
              
              return (
                <div
                  key={time}
                  className={cn(
                    "absolute left-0 right-0 border-t transition-colors",
                    isHalfHour ? "border-border/30" : "border-border",
                    isOutsideShift && "bg-muted/30",
                    isBlocked && "bg-destructive/5"
                  )}
                  style={{ 
                    top: `${topPosition}px`,
                    height: `${SLOT_HEIGHT}px` 
                  }}
                />
              );
            })}

            {/* Work shift indicators */}
            <WorkShiftIndicator
              type="start"
              time={`${workShift.startHour.toString().padStart(2, "0")}:00`}
              style={{ top: `${workStartPosition}px` }}
            />
            <WorkShiftIndicator
              type="end"
              time={`${workShift.endHour.toString().padStart(2, "0")}:00`}
              style={{ top: `${workEndPosition}px` }}
            />

            {/* Blocked time slots */}
            {blockedTimes.map((bt) => (
              <BlockedTimeSlot
                key={bt.id}
                blockedTime={bt}
                style={calculatePositionStyle(bt.startTime, bt.endTime)}
              />
            ))}

            {/* Draggable Appointments */}
            {groupedAppointments.map((group) =>
              group.map((appointment, index) => {
                const style = calculatePositionStyle(appointment.startTime, appointment.endTime);
                const width = `calc(${100 / group.length}% - 8px)`;
                const left = `calc(${(index * 100) / group.length}% + 4px)`;

                return (
                  <DraggableAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    style={{
                      position: "absolute",
                      ...style,
                      width,
                      left,
                    }}
                    onClick={() => onAppointmentClick(appointment)}
                    isOverInvalid={activeId === appointment.id && isOverInvalid}
                    isDragging={activeId === appointment.id}
                    targetTime={activeId === appointment.id ? dragTargetTime : null}
                  />
                );
              })
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Drag overlay for visual feedback */}
      <DragOverlay>
        {activeAppointment && (
          <div className="w-48 opacity-90 shadow-xl">
            <AppointmentCard appointment={activeAppointment} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
