import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Check, Plus, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Unit {
  id: string;
  name: string;
}

const mockUnits: Unit[] = [
  { id: "1", name: "Unidade Centro" },
  { id: "2", name: "Unidade Shopping" },
  { id: "3", name: "Unidade Zona Sul" },
];

const businessName = "Salão Reis";

export const UnitSelector = () => {
  const navigate = useNavigate();
  const [selectedUnit, setSelectedUnit] = useState<Unit>(mockUnits[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setIsOpen(false);
  };

  const handleCreateUnit = () => {
    setIsOpen(false);
    navigate("/nova-unidade");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-2 -ml-2 rounded-xl hover:bg-secondary/50 transition-colors group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
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
            <span className="text-xs text-muted-foreground">{businessName}</span>
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

        {mockUnits.map((unit) => (
          <DropdownMenuItem
            key={unit.id}
            onClick={() => handleSelectUnit(unit)}
            className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
                <MapPin className="h-4 w-4 text-secondary-foreground" />
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
};