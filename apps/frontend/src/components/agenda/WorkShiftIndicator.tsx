import { cn } from "@/lib/utils";

interface WorkShiftIndicatorProps {
  type: "start" | "end";
  time: string;
  style: React.CSSProperties;
}

export const WorkShiftIndicator = ({ type, time, style }: WorkShiftIndicatorProps) => {
  const label = type === "start" ? "Início da jornada de trabalho" : "Fim da jornada de trabalho";
  
  return (
    <div
      style={style}
      className={cn(
        "absolute left-0 right-0 flex items-center z-10 pointer-events-none"
      )}
    >
      <div className="flex-1 border-t-2 border-dashed border-primary/40" />
      <span className="px-2 text-[10px] font-medium text-primary/60 bg-background whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 border-t-2 border-dashed border-primary/40" />
    </div>
  );
};
