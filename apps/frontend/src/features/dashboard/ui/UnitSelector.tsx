import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Check, Plus, MapPin, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useUnit } from "@/contexts/UnitContext";

export function UnitSelector() {
  const navigate = useNavigate();
  const { units, selectedUnit, organization, isLoading, setSelectedUnit } = useUnit();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectUnit = (unit: typeof selectedUnit) => {
    if (unit) {
      setSelectedUnit(unit);
    }
    setIsOpen(false);
  };

  const handleCreateUnit = () => {
    setIsOpen(false);
    navigate("/nova-unidade");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-2 -ml-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        </div>
        <div className="text-left">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-3 w-16 bg-muted rounded animate-pulse mt-1" />
        </div>
      </div>
    );
  }

  // No units state
  if (units.length === 0 || !selectedUnit) {
    return (
      <button
        onClick={() => navigate("/nova-unidade")}
        className="flex items-center gap-2 p-2 -ml-2 rounded-xl hover:bg-secondary/50 transition-colors group"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-dashed border-border">
          <Plus className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="text-left">
          <span className="font-semibold text-foreground text-sm">
            Criar unidade
          </span>
          <div className="text-xs text-muted-foreground">
            Adicione sua primeira unidade
          </div>
        </div>
      </button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-2 -ml-2 rounded-xl hover:bg-secondary/50 transition-colors group">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{
              backgroundColor: selectedUnit.brandColor
                ? `${selectedUnit.brandColor}20`
                : 'rgb(var(--primary) / 0.1)'
            }}
          >
            {selectedUnit.logo ? (
              <img
                src={selectedUnit.logo}
                alt={selectedUnit.name}
                className="w-6 h-6 rounded object-cover"
              />
            ) : (
              <MapPin
                className="h-5 w-5"
                style={{
                  color: selectedUnit.brandColor || 'rgb(var(--primary))'
                }}
              />
            )}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground text-sm">
                {selectedUnit.name}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {organization?.businessName || "Meu negocio"}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-64 bg-card border border-border shadow-card"
        sideOffset={8}
      >
        <div className="px-3 py-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Suas Unidades
          </p>
        </div>

        {units.map((unit) => (
          <DropdownMenuItem
            key={unit.id}
            onClick={() => handleSelectUnit(unit)}
            className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{
                  backgroundColor: unit.brandColor
                    ? `${unit.brandColor}20`
                    : 'rgb(var(--secondary))'
                }}
              >
                {unit.logo ? (
                  <img
                    src={unit.logo}
                    alt={unit.name}
                    className="w-5 h-5 rounded object-cover"
                  />
                ) : (
                  <MapPin
                    className="h-4 w-4"
                    style={{
                      color: unit.brandColor || 'rgb(var(--secondary-foreground))'
                    }}
                  />
                )}
              </div>
              <span className="font-medium text-sm">{unit.name}</span>
            </div>
            {selectedUnit.id === unit.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
          onClick={handleCreateUnit}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg border-2 border-dashed border-border">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            Criar nova unidade
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
