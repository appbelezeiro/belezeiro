import { useState, useEffect } from "react";
import { Trash2, Clock, DollarSign, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ServiceData } from "@/pages/Services";

interface ServiceCardProps {
  service: ServiceData;
  onSave: (updates: Partial<ServiceData>) => void;
  onRemove: () => void;
}

export const ServiceCard = ({ service, onSave, onRemove }: ServiceCardProps) => {
  const [localPrice, setLocalPrice] = useState(service.price);
  const [localDuration, setLocalDuration] = useState(service.duration);

  // Track if there are unsaved changes
  const hasChanges = localPrice !== service.price || localDuration !== service.duration;

  // Sync local state when service prop changes (after save)
  useEffect(() => {
    setLocalPrice(service.price);
    setLocalDuration(service.duration);
  }, [service.price, service.duration]);

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue ? parseInt(numericValue, 10) : 0;
  };

  const formatDuration = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue ? parseInt(numericValue, 10) : 0;
  };

  const handleSave = () => {
    onSave({ price: localPrice, duration: localDuration });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow group">
      {/* Service Name */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <h3 className="font-semibold text-foreground leading-tight">{service.name}</h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover serviço?</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover "{service.name}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onRemove} className="bg-destructive hover:bg-destructive/90">
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Price Input */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <DollarSign className="w-3 h-3" />
            Preço
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              R$
            </span>
            <Input
              type="text"
              inputMode="numeric"
              value={localPrice > 0 ? localPrice.toString() : ""}
              onChange={(e) => setLocalPrice(formatPrice(e.target.value))}
              placeholder="0"
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Duration Input */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Duração
          </label>
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              value={localDuration > 0 ? localDuration.toString() : ""}
              onChange={(e) => setLocalDuration(formatDuration(e.target.value))}
              placeholder="30"
              className="pr-12 h-9"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              min
            </span>
          </div>
        </div>

        {/* Save Button - Only shows when there are changes */}
        {hasChanges && (
          <Button onClick={handleSave} size="sm" className="w-full mt-2">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        )}
      </div>
    </div>
  );
};
