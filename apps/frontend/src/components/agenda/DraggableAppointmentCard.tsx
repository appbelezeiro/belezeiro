import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { AppointmentCard, Appointment } from "./AppointmentCard";
import { cn } from "@/lib/utils";

interface DraggableAppointmentCardProps {
  appointment: Appointment;
  style: React.CSSProperties;
  onClick: () => void;
  isOverInvalid?: boolean;
  isDragging?: boolean;
  targetTime?: string | null;
}

export const DraggableAppointmentCard = ({
  appointment,
  style,
  onClick,
  isOverInvalid,
  isDragging,
  targetTime,
}: DraggableAppointmentCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: appointment.id,
    data: { appointment },
  });

  const dragStyle: React.CSSProperties = {
    ...style,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 1000 : 1,
    transition: isDragging ? "none" : "all 0.2s ease",
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger click if not dragging
    if (!isDragging) {
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...listeners}
      {...attributes}
      className={cn(
        "touch-none relative",
        isDragging && "cursor-grabbing shadow-xl scale-[1.02]",
        isOverInvalid && "ring-2 ring-destructive"
      )}
    >
      {/* Target time indicator */}
      {isDragging && targetTime && (
        <div 
          className={cn(
            "absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md text-sm font-semibold shadow-lg z-[1001] whitespace-nowrap",
            isOverInvalid 
              ? "bg-destructive text-destructive-foreground" 
              : "bg-primary text-primary-foreground"
          )}
        >
          {targetTime}
        </div>
      )}
      
      <AppointmentCard
        appointment={appointment}
        onClick={handleClick}
      />
    </div>
  );
};
