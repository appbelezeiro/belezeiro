import { Megaphone } from "lucide-react";

interface PublicAdSpaceProps {
  size?: "small" | "medium" | "large";
}

export const PublicAdSpace = ({ size = "medium" }: PublicAdSpaceProps) => {
  const heights = {
    small: "h-20",
    medium: "h-32",
    large: "h-48",
  };

  return (
    <div className={`w-full ${heights[size]} bg-muted/30 border border-dashed border-border rounded-xl flex items-center justify-center my-6`}>
      <div className="text-center text-muted-foreground">
        <Megaphone className="h-6 w-6 mx-auto mb-2 opacity-50" />
        <p className="text-xs opacity-70">Espaço para anúncio</p>
      </div>
    </div>
  );
};
