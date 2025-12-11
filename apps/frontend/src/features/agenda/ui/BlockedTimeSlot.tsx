import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlockedTime } from "../types";

interface BlockedTimeSlotProps {
  blockedTime: BlockedTime;
  style: React.CSSProperties;
}

export function BlockedTimeSlot({ blockedTime, style }: BlockedTimeSlotProps) {
  return (
    <div
      style={style}
      className={cn(
        "absolute left-1 right-1 rounded-lg",
        "bg-destructive/10 border border-destructive/20",
        "flex items-center justify-center gap-2",
        "cursor-not-allowed select-none"
      )}
    >
      <Lock className="h-4 w-4 text-destructive/60" />
      <span className="text-sm font-medium text-destructive/70">
        {blockedTime.reason}
      </span>
    </div>
  );
}
