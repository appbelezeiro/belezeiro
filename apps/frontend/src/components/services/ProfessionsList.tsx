import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProfessionData } from "@/pages/Services";
import type { Profession } from "@/data/professions";

interface ProfessionsListProps {
  professions: ProfessionData[];
  availableProfessions: Profession[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddProfession: (id: string, name: string, icon: string) => void;
}

export const ProfessionsList = ({
  professions,
  availableProfessions,
  selectedId,
  onSelect,
  onAddProfession,
}: ProfessionsListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProfessionName, setNewProfessionName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter available professions by search query
  const filteredProfessions = availableProfessions.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    if (newProfessionName.trim()) {
      onAddProfession(
        `profession-${Date.now()}`,
        newProfessionName.trim(),
        "📋"
      );
      setNewProfessionName("");
      setSearchQuery("");
      setIsModalOpen(false);
    }
  };

  const handleSelectProfession = (profession: Profession) => {
    onAddProfession(profession.id, profession.name, profession.icon);
    setSearchQuery("");
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewProfessionName("");
    setSearchQuery("");
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Profissões</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {professions.length} especialidade{professions.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="p-2">
        <div className="space-y-1">
          {professions.map((profession) => (
            <button
              key={profession.id}
              onClick={() => onSelect(profession.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                selectedId === profession.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-secondary/60 text-foreground"
              )}
            >
              <span className="text-lg">{profession.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{profession.name}</p>
                <p
                  className={cn(
                    "text-xs",
                    selectedId === profession.id
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {profession.services.length} serviço{profession.services.length !== 1 ? "s" : ""}
                </p>
              </div>
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar profissão
        </Button>
      </div>

      {/* Add Profession Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Profissão</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {/* Search/Create Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ou criar nova profissão..."
                value={searchQuery || newProfessionName}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setNewProfessionName(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAddNew()}
                className="pl-10"
                autoFocus
              />
            </div>

            {/* Available Professions from Catalog */}
            {filteredProfessions.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Profissões disponíveis
                </p>
                <ScrollArea className="h-56">
                  <div className="grid grid-cols-2 gap-2">
                    {filteredProfessions.map((profession) => (
                      <button
                        key={profession.id}
                        onClick={() => handleSelectProfession(profession)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-secondary/50 hover:bg-secondary text-sm font-medium text-foreground transition-colors border border-border hover:border-primary/30 text-left"
                      >
                        <span className="text-lg">{profession.icon}</span>
                        <span className="truncate">{profession.name}</span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Create New Option */}
            {newProfessionName.trim() && !availableProfessions.some(p => 
              p.name.toLowerCase() === newProfessionName.toLowerCase()
            ) && (
              <Button onClick={handleAddNew} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Criar "{newProfessionName}"
              </Button>
            )}

            {/* Empty state when no matches */}
            {filteredProfessions.length === 0 && !newProfessionName.trim() && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Todas as profissões do catálogo já foram adicionadas
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
